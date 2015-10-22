var gulp = require('gulp'),
    del = require('del'),
    merge = require('merge-stream'),
    wiredep = require('wiredep').stream,
    $ = require('gulp-load-plugins')({ lazy: true });

var config = {
    // local
    html: './client/index.html',
    js: './client/**/*.js',

    // bower
    bowerOverrides: {
        bootstrap: {
            main: [
                'dist/css/bootstrap.css',
                'dist/js/bootstrap.js'
            ]
        },
        octicons: {
            main: [
                'octicons/octicons.css',
                'octicons/octicons.eot',
                'octicons/octicons.svg',
                'octicons/octicons.ttf',
                'octicons/octicons.woff'
            ]
        }
    }
};

/**
 * Injects the dependencies into the html.
 * @returns {stream} The stream.
 */
gulp.task('inject', function () {
    return gulp.src(config.html)
        .pipe(wiredep({
            ignorePath: '..',
            overrides: config.bowerOverrides
        }))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest('./client/'));
});

/**
 * Injects the CSS and JS into the HTML, and runs the server; everything is monitored.
 * @returns {stream} The stream.
 */
gulp.task('serve', ['inject'], function () {
    return $.nodemon({
        script: './bin/www',
        ignore: [
            'bower_components/*',
            'client/*',
            'gulpfile.js'
        ],
        env: {
            'NODE_ENV': 'development'
        }
    }).on('start', function () {
        gulp.watch(config.js, ['inject']);
    });
});

gulp.task('default', ['serve']);
