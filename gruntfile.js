module.exports = function (grunt) {
    // configure the tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            // concats and moves the required files from the bower components
            bower: {
                files: {
                    'public/css/vendor.css': [
                        'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
                    ],
                    'public/js/vendor.js': ['bower_components/angular/angular.min.js'],
                }
            },
        },
        copy: {
            // copies the required files from the bower components
            bower: {
                src: 'bower_components/bootstrap/dist/fonts/*',
                dest: 'public/fonts/',
                expand: true,
                flatten: true
            }
        },
        exec: {
            // installs the bower components
            bower: {
                cmd: 'bower install'
            }
        }
    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');

    // register the available tasks
    grunt.registerTask('default', ['exec:bower', 'concat:bower', 'copy:bower']);
};