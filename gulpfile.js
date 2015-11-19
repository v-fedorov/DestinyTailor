var gulp = require('gulp'),
    del = require('del'),
    merge = require('merge-stream'),
    wiredep = require('wiredep').stream,
    $ = require('gulp-load-plugins')({ lazy: true });

var client = './client/';
var config = {
    // local files
    css: client + 'css/*.css',
    html: client + 'index.html',
    fonts: [
        client + 'fonts/*.*',
        './bower_components/bootstrap/dist/fonts/*.*',
        './bower_components/roboto-fontface/fonts/Roboto-Bold.*',
        './bower_components/roboto-fontface/fonts/Roboto-Light.*',
        './bower_components/roboto-fontface/fonts/Roboto-Medium.*',
        './bower_components/roboto-fontface/fonts/Roboto-Regular.*'
    ],
    js: [
        client + 'js/main.js',
        client + 'js/models/*.js',
        client + 'js/services/*.js',
        client + 'js/**/*.js'
    ],
    templates: client + 'js/views/*.html',

    // local folders
    client: client,
    dist: './dist/',
    temp: './.tmp/',

    // ng-annotate
    ngAnnotate: {
        add: true,
        single_quotes: true
    },

    // angular template cache
    templateCache: {
        file: 'templates.js',
        options: {
            module: 'main',
            root: 'js/views/',
            standAlone: false
        }
    },

    // useref
    useref: {
        searchPath: './'
    },

    // wiredep
    wiredep: {
        ignorePath: '..',
        overrides: {
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
    }
};

/**
 * Prepares the distribution folder.
 */
gulp.task('build', ['fonts', 'optimize']);

/**
 * Moves all required fonts to the build folder.
 * @returns {Object} The stream.
 */
gulp.task('fonts', function() {
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.dist + 'fonts'));
});

/**
 * Validates the styling of the client-side JavaScript.
 * @returns {Object} The stream.
 */
gulp.task('jscs', function() {
    return gulp
        .src(config.js)
        .pipe($.jscs())
        .pipe($.jscs.reporter());
});

/**
 * Injects the dependencies into the html.
 * @returns {Object} The stream.
 */
gulp.task('inject', function() {
    return gulp
        .src(config.html)
        // bower
        .pipe(wiredep(config.wiredep))
        // css and js
        .pipe($.inject(gulp.src(config.css)))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

/**
 * Optimizes the client files for distribution.
 * @returns {Object} The stream.
 */
gulp.task('optimize', ['inject', 'template-cache'], function() {
    var htmlFilter = $.filter('**/*.html', { restore: true });

    return gulp
        .src(config.html)
        // add references
        .pipe($.inject(gulp.src(config.temp + config.templateCache.file), { name: 'inject:templates' }))
        .pipe($.useref(config.useref))
        // minify the js and css
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss()))
        // minify the html
        .pipe(htmlFilter)
        .pipe($.minifyHtml({empty: true}))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(config.dist));
});

/**
 * Create $templateCache from the html templates
 * @returns {Object} The stream.
 */
gulp.task('template-cache', function() {
    return gulp
        .src(config.templates)
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(config.templateCache.file, config.templateCache.options))
        .pipe(gulp.dest(config.temp));
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