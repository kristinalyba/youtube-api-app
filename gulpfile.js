var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')({
    lazy: true
});

var config = require('./gulp.config')();

gulp.task('clean', function (done) {
    var delconfig = [].concat(config.build);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

gulp.task('clean-fonts', function (done) {
    log('Cleaning fonts before copying.');

    clean(config.build + 'fonts/**/*.*', done);
});

gulp.task('clean-code', function (done) {
    log('Cleaning code.');
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + '**/*.js')
    clean(files, done);
});

gulp.task('clean-temp', function (done) {
    log('Cleaning temp folder.');
    var tempFiles = config.temp + '*.*';
    clean(tempFiles, done);
});

gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying fonts into build folder');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('inject', ['templatecache'], function () {
    log('Inject css into index.html');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.root));
});

gulp.task('optimize', ['inject', 'fonts'], function () {
    log('Optimizing the javascript, css, html');

    var templateChache = config.temp + config.templateCache.file;
    var assets = $.useref.assets({
        searchPath: config.root
    });
    var cssFilter = $.filter(['**/*.css'], {
        restore: true
    });
    var jsFilter = $.filter(['**/*.js'], {
        restore: true
    });

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(templateChache, {
            read: false
        }), {
            starttag: '<!-- inject:templates:js -->'
        }))
        .pipe(assets)
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore)
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(config.build));
});

gulp.task('templatecache', ['clean-code'], function () {
    log('Creating AngularJS $templateCahce');

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({
            empty: true
        }))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options))
        .pipe(gulp.dest(config.temp));
});

gulp.task('serve-build', ['optimize'], function () {
    log('Build finished.');
    clean(config.temp + '*.*');
})

/////////////////////////

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
