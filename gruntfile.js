var dotenv = require('dotenv');

module.exports = function (grunt) {
    dotenv.load();

    // configure the tasks
    grunt.initConfig({
        concat: {
            // concats and moves the required files from the bower components
            css: {
                files: {
                    'public/dist/css/main.css': [
                        'src/css/main.css'
                    ],
                }
            },
            bootstrap: {
                files: {
                    'public/vendor/css/bootstrap.css': [
                        'bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'bower_components/bootstrap-toggle/css/bootstrap-toggle.min.css'
                    ]
                }
            }
        },
        clean: [
            'public/dist',
            'public/vendor'
        ],
        copy: {
            css: {
                src: ['bower_components/octicons/octicons/octicons.css'],
                dest: 'public/vendor/css/',
                expand: true,
                flatten: true
            },
            fonts: {
                src: [
                    '!bower_components/octicons/octicons/*-local.ttf',
                    'bower_components/bootstrap/dist/fonts/*',
                    'bower_components/octicons/octicons/*.ttf',
                    'bower_components/octicons/octicons/*.woff',
                    'bower_components/roboto-fontface/fonts/Roboto-Regular.*'
                ],
                dest: 'public/vendor/fonts/',
                expand: true,
                flatten: true
            }
        },
        env: {
            apiKey: process.env.API_KEY || ''
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'public/dist/index.html': 'src/index.html'
                }
            },
        },
        prompt: {
            apiKey: {
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
            js: {
                files: {
                    'public/dist/js/main.js': [
                        'src/js/main.js'
                    ]
                }
            },
            bootstrap: {
                files: {
                    'public/vendor/js/bootstrap.min.js': [
                        'bower_components/bootstrap/dist/js/bootstrap.min.js',
                        'bower_components/bootstrap-toggle/js/bootstrap-toggle.min.js'
                    ]
                }
            }
        },
        watch: {
            css: {
                files: 'src/css/*.css',
                tasks: 'concat:css'
            },
            js: {
                files: 'src/js/*.js',
                tasks: 'uglify:js'
            },
            html: {
                files: ['src/index.html'],
                tasks: 'htmlmin:dist'
            }
        }
    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-prompt');

    // register the task to save the local config
    grunt.registerTask('save-config', 'Saves the local configuration.', function() {
        var config = {
                apiKey: grunt.config('grunt-prompt.apiKey')
            };

        grunt.file.write('.env', 'API_KEY=' + config.apiKey);
        grunt.log.ok('Saved to [.env]');
    });

    // register the available tasks
    grunt.registerTask('default', ['clean', 'concat', 'copy', 'uglify', 'htmlmin']);
    grunt.registerTask('config', ['prompt:apiKey', 'save-config']);
};