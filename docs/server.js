var express = require('express'),
    cluster = require('cluster'),
    fs = require('fs'),
    env = require('./config/environment.js'),
    app = express(),
    gutil = require('gulp-util');
var compression = require('compression');

var mode = process.argv.slice(-1)[0],
    fullMode = 'source',
    path = './' + process.argv.slice(-1)[0],
    filesPath = require('path').join(__dirname, path),
    port = path === './src' ? env.serverProperties.port.local : env.serverProperties.port.prod;

switch (mode) {
    case 'dev':
        fullMode = 'development';
        break;
    case 'prod':
        fullMode = 'production';
        break;
}

var debug = typeof v8debug === 'object';

if (cluster.isMaster && !debug) {
    var cpuCount = 2;

    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('listening', function (worker) {
        gutil.log('Worker #' + gutil.colors.magenta(worker.id) + ' on \'' + gutil.colors.cyan(fullMode) + '\' mode listening on port ' + gutil.colors.magenta(port));
    });

    cluster.on('exit', function (worker) {
        gutil.log(gutil.colors.red('Worker #' + gutil.colors.magenta(worker.id) + ' died'));
        cluster.fork();
    });
} else {
    app.use(compression());
    app.use(express.static(filesPath));
    app.set('views', filesPath);

    app.get('/*', function(req, res){
        var fullUrl = filesPath + '/index.html';
        fs.readFile(fullUrl, 'utf8', function(err, text){
            if (debug)
                gutil.log('Requested url: ' + gutil.colors.cyan(req.url))
            res.send(text);
        });
    });

    app.listen(port, function () {
        if (debug)
            gutil.log('Server on ' + gutil.colors.cyan('debug') + ' mode listening on port ' + gutil.colors.magenta(port));
    });
}
