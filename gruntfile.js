module.exports = function (grunt) {
    var localConfigPath = 'server/config/local.json';

    // configure the tasks
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        local: grunt.file.exists(localConfigPath) ? grunt.file.readJSON(localConfigPath) : {},
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
                            default: '<%= local.apiKey %>',
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
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-prompt');

    // register the task to save the local config
    grunt.registerTask('save-local-config', 'Saves the local configuration.', function() {
        var config = {
                apiKey: grunt.config('grunt-prompt.apiKey')
            };

        grunt.file.write(localConfigPath, JSON.stringify(config));
        grunt.log.ok('Saved to [' + localConfigPath + ']');
    });

    // register the available tasks
    grunt.registerTask('default', ['prompt:target', 'save-local-config', 'exec:bower', 'concat:bower', 'copy:bower']);
};