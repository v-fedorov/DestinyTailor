var gulp = require('gulp'),
    concat = require('gulp-concat'),
    del = require('del'),
    flatten = require('gulp-flatten'),
    merge = require('merge-stream'),
    minifyCss = require('gulp-minify-css'),
    minifyHtml = require('gulp-minify-html'),
    uglify = require('gulp-uglify');

var jsSrc = [
    '!src/js/main.min.js',
    'src/js/main.js',
    'src/js/**/*.js'
];

gulp.task('clean', function(callback) {
    del.sync([
        'public/dist',
        'public/vendor'
    ]);

    callback();
});

gulp.task('main:css', function() {
    return gulp.src('src/css/main.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('public/dist/css'));
});

gulp.task('main:html', function() {
    return gulp.src('src/index.html')
        .pipe(minifyHtml())
        .pipe(gulp.dest('public/dist'));
});

gulp.task('main:js', function() {
    return gulp.src(jsSrc)
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('src/js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/dist/js'));
});

gulp.task('vendor:css', function() {
    var bootstrapSrc = [
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/bootstrap-toggle/css/bootstrap-toggle.min.css'
    ];

    var bootstrap = gulp.src(bootstrapSrc)
        .pipe(concat('bootstrap.css'))
        .pipe(gulp.dest('public/vendor/css'));

    var octicons = gulp.src('bower_components/octicons/octicons/octicons.css')
        .pipe(gulp.dest('public/vendor/css/'));

    return merge(bootstrap, octicons);
});

gulp.task('vendor:fonts', function() {
    var fontsSrc = [
        '!bower_components/octicons/octicons/*-local.ttf',
        'bower_components/bootstrap/dist/fonts/*',
        'bower_components/octicons/octicons/*.ttf',
        'bower_components/octicons/octicons/*.woff',
        'bower_components/roboto-fontface/fonts/Roboto-Regular.*'
    ];

    return gulp.src(fontsSrc)
        .pipe(flatten())
        .pipe(gulp.dest('public/vendor/fonts'));
});

gulp.task('vendor:js', function() {
    var bootstrapSrc = [
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/bootstrap-toggle/js/bootstrap-toggle.min.js'
    ];

    return gulp.src(bootstrapSrc)
        .pipe(concat('bootstrap.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/vendor/js/'));
});

gulp.task('watch:js', function() {
     gulp.watch(jsSrc, ['main:js']);
});

gulp.task('main', ['main:css', 'main:html', 'main:js']);
gulp.task('vendor', ['vendor:css', 'vendor:fonts', 'vendor:js']);
gulp.task('watch', ['watch:js']);

gulp.task('default', ['clean', 'vendor', 'main']);