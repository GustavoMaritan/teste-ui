const gulp = require('gulp');
/**
 * @param {{
 * htmlmin
 * plumber,
 * angularEmbedTemplates,
 * angularFilesort,
 * ngAnnotate,
 * autoprefixer,
 * concatCss,
 * cleanCss,
 * angularTemplatecache
 * runSequence
 * }} Dynamic methods
 */
const $ = require('gulp-load-plugins')({pattern: '*'});

const paths = {
    templates: '**/*.tpl.html',
};

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

function minifyScript(dest) {
    const optionsEmbed = {
        basePath: 'src/' //Pegando os templates pela pasta src
    };
    return gulp.src(['!**/smn-ui.*', '**/*.js',], {cwd: 'src'})
        .pipe($.plumber())
        .pipe($.babel())
        .pipe($.angularEmbedTemplates(optionsEmbed))
        .pipe($.angularFilesort())
        .pipe($.concat('smn-ui.min.js'))
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
        .pipe($.if(concat, $.concatCss('smn-ui.min.css')))
        .pipe($.cleanCss())
        .pipe(gulp.dest(dest));
}

gulp.task('template', () => {
    const templates = gulp.src(paths.templates, {cwd: 'src'}).pipe($.plumber());

    return templates
        .pipe(minifyHtml())
        .pipe($.angularTemplatecache('app.templates.js', {
            module: 'smn-ui'
        }))
        .pipe(gulp.dest('src/'));
});

gulp.task('minify:css', () => {
    return minifyStyle(['!**/smn-ui.*', '**/*.css'], 'src/', true);
});

gulp.task('minify:js', () => {
    return minifyScript('src/');
});

gulp.task('concat:css', () => {
    return gulp.src(['!**/smn-ui.*', '**/*.css'], {cwd: 'src'})
        .pipe($.plumber())
        .pipe($.autoprefixer({
            browsers: ['> 1%', 'IE 7'],
            cascade: false
        }))
        .pipe($.concatCss('smn-ui.css'))
        .pipe(gulp.dest('src/'));
});

gulp.task('concat:js', () => {
    const optionsEmbed = {
        basePath: 'src/' //Pegando os templates pela pasta src
    };
    return gulp.src(['!**/smn-ui.*', '**/*.js'], {cwd: 'src'})
        .pipe($.plumber())
        .pipe($.babel())
        .pipe($.angularEmbedTemplates(optionsEmbed))
        .pipe($.angularFilesort())
        .pipe($.concat('smn-ui.js'))
        .pipe($.ngAnnotate())
        .pipe(gulp.dest('src/'));
});

gulp.task('clean', () => {
    return gulp.src(['dist/smn-ui.*' , 'src/*.min.*', 'src/app.templates.js'], {read: false})
        .pipe($.clean());
});

gulp.task('dist', () => {
    gulp.src('src/smn-ui.*')
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['clean'], () => {
    $.runSequence('template', ['concat:css', 'concat:js', 'minify:css', 'minify:js'], 'dist');
});
