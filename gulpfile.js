var gulp = require('gulp'),
    del = require('del'),
    merge = require('merge-stream'),
    wiredep = require('wiredep').stream,
    $ = require('gulp-load-plugins')({ lazy: true });

var config = {
    // local
    html: 'client/index.html',
    js: [
        'client/js/main.js',
        'client/js/models/*.js',
        'client/js/services/*.js',
        'client/js/**/*.js'
    ],

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
 * Validates the styling of the client-side JavaScript.
 * @returns {Object} The stream.
 */
gulp.task('jscs', function() {
    return gulp.src(config.js)
        .pipe($.jscs())
        .pipe($.jscs.reporter());
});

/**
 * Injects the dependencies into the html.
 * @returns {Object} The stream.
 */
gulp.task('inject', function() {
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
 * @returns {Object} The stream.
 */
gulp.task('serve', ['inject'], function() {
    return $.nodemon({
        script: './bin/www',
        ignore: [
            'bower_components/**/*',
            'client/**/*',
            'gulpfile.js'
        ],
        env: {
            'NODE_ENV': 'development'
        }
    }).on('start', function(ev) {
        gulp.watch(config.js, function(ev) {
            if (ev.type === 'added' || ev.type === 'deleted') {
                gulp.start('inject');
            };
        });
    });
});

gulp.task('default', ['serve']);
