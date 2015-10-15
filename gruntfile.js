var dotenv = require('dotenv');

module.exports = function (grunt) {
    dotenv.load();

    // configure the tasks
    grunt.initConfig({
        concat: {
            // concats and moves the required files from the bower components
            bower: {
                files: {
                    'dist/css/main.css': [
                        'src/css/main.css'
                    ],
                    'dist/css/vendor.css': [
                        'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'bower_components/bootstrap-toggle/css/bootstrap-toggle.min.css',
                        'bower_components/octicons/octicons/octicons.css'
                    ]/*,
                    'dist/js/vendor.js': [
                        'bower_components/angular/angular.js',
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'bower_components/bootstrap-toggle/js/bootstrap-toggle.min.js'
                    ]*/
                }
            },
        },
        copy: {
            fonts: {
                src: [
                    '!bower_components/octicons/octicons/*-local.ttf',
                    'bower_components/bootstrap/dist/fonts/*',
                    'bower_components/octicons/octicons/*.ttf',
                    'bower_components/octicons/octicons/*.woff'
                ],
                dest: 'dist/fonts/',
                expand: true,
                flatten: true
            },
            html: {
                src: [
                    'src/*.html'
                ],
                dest: 'dist/',
                expand: true,
                flatten: true
            }
        },
        env: {
            apiKey: process.env.API_KEY || ''
        },
        prompt: {
            target: {
                options: {
                    questions: [
                        {
                            // API key
                            name: "grunt-prompt.apiKey",
                            message: 'Bungie API Key:',
                            type: 'input',
                            default: '<%= env.apiKey %>',
                            validate: function(value) {
                                return value !== undefined && value !== null && value !== '';
                            }
                        }
                    ]
                }
            },
        },
        uglify: {
            main: {
                files: {
                    'dist/js/main.min.js': [
                        'src/js/main.js'
                    ],
                    'dist/js/vendor.min.js': [
                        'bower_components/angular/angular.js',
                        'bower_components/jquery/dist/jquery.min.js',
                        'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'bower_components/bootstrap-toggle/js/bootstrap-toggle.min.js'
                    ]
                }
            }
        }
    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-prompt');

    // register the task to save the local config
    grunt.registerTask('save-local-config', 'Saves the local configuration.', function() {
        var config = {
                apiKey: grunt.config('grunt-prompt.apiKey')
            };

        grunt.file.write('.env', 'API_KEY=' + config.apiKey);
        grunt.log.ok('Saved to [.env]');
    });

    // register the available tasks
    grunt.registerTask('default', ['concat', 'copy', 'uglify']);

    grunt.registerTask('dev', ['prompt:target', 'save-local-config']);
};