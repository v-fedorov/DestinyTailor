var dotenv = require('dotenv');

module.exports = function (grunt) {
    dotenv.load();

    // configure the tasks
    grunt.initConfig({
        env: {
            apiKey: process.env.API_KEY || ''
        },
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
    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
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
    grunt.registerTask('default', ['concat:bower', 'copy:bower']);
    grunt.registerTask('dev', ['prompt:target', 'save-local-config']);
};