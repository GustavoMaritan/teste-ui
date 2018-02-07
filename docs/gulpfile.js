var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({pattern: '*'}),
    isProductionMode = !!$.util.env.production || !!$.util.env.prod,
    isDevMode = !isProductionMode,
    isWatchMode = $.util.env.watch,
    mode = 'dev',
    fullMode = 'development';

if (isProductionMode) {
    mode = 'prod';
    fullMode = 'production';
}

var ext = {
    minified: 'min',
    prepare: 'pre',
    template: 'tpl'
}

var paths = {
        scripts: {
            lib: {
                common: ['content/lib/jquery/dist/jquery.min.js', 'content/lib/angular/angular.min.js', 'content/lib/angular-*/**/*.min.js', 'content/lib/angular-i18n/**/angular-locale_pt-br.js', 'content/lib/socket.io-client/socket.io.js', '!content/lib/jquery/external/**/*'],
                dev: [],
                prod: ['content/lib/smn-ui/smn-ui.min.js']
            },
            src: {
                pre: 'app/**/*.pre.js',
                common: ['app/**/*.js', '!app/**/*.pre.js', '!**/*.min.js'],
                dev: [],
                prod: ['!app/smn-ui/**/*']
            }
        },
        styles: {
            src: {
                pre: 'app/**/*.pre.css',
                common: ['app/core/**/*.css', 'app/ui/**/*.css', 'app/utils/**/*.css', 'app/seguranca/login/**/*.css', '!**/*.min.css', '!app/**/*.pre.css'],
                dev: ['app/smn-ui/**/*.css'],
                prod: [],
                build: ['app/app.min.css', 'app/**/*.css', '!app/+(core|ui|utils)/**/*', '!app/seguranca/login/**/*.css', '!app/**/*.pre.css']
            }
        },
        index: {
            build: ['app/app.min.css', 'app/app.min.js'],
            pre: 'index.pre.html',
            final: 'index.html'
        },
        templates: 'app/**/*.tpl.html',
        dest: {
            src: 'src',
            prod: 'prod',
            dev: 'dev',
            app: '/app'
        }
    },
    buildPaths = ['src/app/app.min.js', 'src/app/**/*.html', 'src/favicon.ico', 'src/content/**/*'],
    modeConfig = {
        paths: {
            styles: [...paths.styles.src.common, ...paths.styles.src[mode]],
            scripts: {
                lib: [...paths.scripts.lib.common, ...paths.scripts.lib[mode]],
                src: [...paths.scripts.src.common, ...paths.scripts.src[mode]]
            }
        }
    };

modeConfig.paths.index = [...modeConfig.paths.styles, ...modeConfig.paths.scripts.lib, ...modeConfig.paths.scripts.src];

modeConfig.files = {
    styles: gulp.src(modeConfig.paths.styles, {cwd: 'src', read: false}).pipe($.plumber()),
    scripts: {
        lib: gulp.src(modeConfig.paths.scripts.lib, {cwd: 'src'}).pipe($.plumber()),
        src: gulp.src(modeConfig.paths.scripts.src, {cwd: 'src'}).pipe($.plumber()).pipe($.angularFilesort())
    }
};

modeConfig.files.index = $.streamSeries(modeConfig.files.styles, modeConfig.files.scripts.lib, modeConfig.files.scripts.src);

function removePreSuffix() {
    return $.rename(function (path) {
        path.basename = path.basename.replace(/\.pre$/, '');
    });
}

function processedFileName() {
    return $.rename(function (path) {
        path.basename = path.basename.replace(/\.pre$/, '.pro');
    })
}

function minifiedFileName() {
    return $.rename(function (path) {
        path.basename = ext.minified + path.extname;
    });
}

function injectFiles(dest, filesToInject) {
    var files = gulp.src(paths.index.pre, {cwd: 'src'}).pipe($.plumber()),
        options = {
            relative: true
        };

    return files.pipe(
        $.inject(filesToInject || $.streamSeries(
                gulp.src(modeConfig.paths.styles, {cwd: 'src', read: false})
                    .pipe($.plumber()),
                gulp.src(modeConfig.paths.scripts.lib, {cwd: 'src'})
                    .pipe($.plumber()),
                gulp.src(modeConfig.paths.scripts.src, {cwd: 'src'})
                    .pipe($.plumber()).pipe($.angularFilesort())),
            options))
        .pipe(removePreSuffix())
        .pipe(gulp.dest(dest));
}

function minifyHtml() {
    return $.htmlmin({
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
    });
}

function modePreprocess(dest) {
    return gulp.src([paths.scripts.src.pre, paths.styles.src.pre], {cwd: 'src'})
        .pipe($.plumber())
        .pipe($.preprocess({context: {NODE_ENV: mode}}))
        .pipe(processedFileName())
        .pipe(gulp.dest(dest));
}

function minifyScript(dest) {
    return gulp.src(modeConfig.paths.scripts.src, {cwd: 'src'})
        .pipe($.plumber())
        .pipe($.angularFilesort())
        .pipe($.concat('app.min.js'))
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(gulp.dest(dest));
}

function minifyStyle(src, dest, concat) {
    return gulp.src(src, {cwd: 'src'})
        .pipe($.plumber())
        .pipe($.autoprefixer({
            browsers: ['> 1%', 'IE 7'],
            cascade: false
        }))
        .pipe($.if(concat, $.concatCss('app.min.css')))
        .pipe($.cleanCss())
        .pipe(gulp.dest(dest));
}

function getDestRoot(modeName) {
    return modeName ? modeName + '/' : 'src/';
}

// Inject na index
gulp.task('index', () => {
    if (isWatchMode)
        gulp.watch(['src/app/**/*', '!src/app/**/*.{min,templates,pro}.*', 'src/index.pre.html'], ['index']);

    return injectFiles(paths.dest.src);
});

// Template cache no Angular para todos os .tpl
// Não pode ser assíncrono, pois a index depente desse arquivo
gulp.task('template', () => {
    if (isWatchMode)
        gulp.watch(paths.templates, {cwd: 'src'}, ['template']);

    var templates = gulp.src(paths.templates, {cwd: 'src'}).pipe($.plumber());

    return templates.pipe(minifyHtml())
        .pipe($.angularTemplatecache('app.templates.js', {
            module: 'documentacao',
            root: 'app'
        }))
        .pipe(gulp.dest(getDestRoot() + paths.dest.app));
});

gulp.task('preprocess', () => {
    if (isWatchMode)
        gulp.watch([paths.scripts.src.pre, paths.styles.src.pre], ['preprocess']);

    return modePreprocess(getDestRoot() + paths.dest.app);
});

gulp.task('minify:css', () => {
    if (isWatchMode)
        gulp.watch(['app/**/*.css', '!app/**/*.{min,templates,pro}.css'], ['minify:css']);

    return minifyStyle(paths.styles.src.common, getDestRoot() + paths.dest.app, true);
});

gulp.task('minify:js', () => {
    if (isWatchMode)
        gulp.watch(['app/**/*.js', '!app/**/*.{min,templates,pro}.js'], ['minify:js']);

    return minifyScript(getDestRoot() + paths.dest.app);
});

gulp.task('minify', () => {
    return $.runSequence('minify:css', 'minify:js');
});

gulp.task('smn-ui:clean', () => {
    return gulp.src(['src/app/smn-ui/'], {read: false}).pipe($.clean());
});

gulp.task('smn-ui', () => {
    if (isWatchMode)
        gulp.watch(['../src/**/*.{js,css,html}', '!../src/**/*.min.*'], ['smn-ui']);

    if (!isProductionMode) {
        return gulp.src(['../src/**/*.*', '!../src/*.min.*', '!../src/app.templates.js'])
            .pipe(gulp.dest('src/app/smn-ui'));
    }
});

gulp.task('build:clean', () => {
    return gulp.src(mode, {read: false}).pipe($.clean());
});

gulp.task('build:style', () => {
    var stylesPath = paths.styles.src.build;
    return minifyStyle(stylesPath, getDestRoot(mode) + paths.dest.app, true);
});

gulp.task('build:index', () => {
    var indexFiles = gulp.src([...paths.scripts.lib.common, ...paths.scripts.lib[mode], ...paths.index.build], {cwd: 'src'});
    return injectFiles(getDestRoot(mode), indexFiles);
});

gulp.task('build:files', () => {
    var buildFiles = gulp.src(buildPaths, {base: 'src'});
    return buildFiles.pipe(gulp.dest(getDestRoot(mode)));
});

gulp.task('build', () => {
    var startTime = process.hrtime();
    if (isWatchMode)
        gulp.watch(['src/app/**/*', '!src/app/**/*.{min,templates,pro}.*'], ['build']);

    $.runSequence('build:clean', 'smn-ui', 'template', 'preprocess', 'minify:css', 'minify:js', 'build:style', 'build:files', 'build:index', function () {
        var endTime = process.hrtime(startTime);
        $.util.log('Finished \'' + $.util.colors.cyan(fullMode) + '\' build after ' + $.util.colors.magenta($.prettyHrtime(endTime)));
    });
});

gulp.task('default', () => {
    $.runSequence('smn-ui', 'template', 'preprocess', 'index');
});

gulp.task('all:watch', ['template', 'preprocess', 'index'] ,() => {
    gulp.watch(['src/app/**/*', '../src/**/*.{js,css,html}', '!../src/**/*.min.*'], () => {
        $.runSequence('template', 'preprocess', 'index');
    });
});

// Usado para limpar a variável de watch, para não problema de acionar o watch várias vezes
setTimeout(function () {
    isWatchMode = false;
});
