'use strict';

module.exports = function (grunt) {

    var javascriptSourceFiles = [
        'app/app.js',
        'app/*.js',
        'app/**/*.js',
        'components/*.js',
        'components/**/*.js',
        'components/**/**/*.js',
        'components/**/**/**/*.js'
    ];

    var htmlfiles = [
        'app/**/*.html',
        'app/**/**/*.html',
        'components/**/*.html',
        'components/**/**/*.html',
        'components/**/**/**/*.html',
    ];

    var filesWatch = javascriptSourceFiles.concat(htmlfiles);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: javascriptSourceFiles,
                dest: 'dist/js/app.js'
            }
        },
        uglify: {
            options: {
                compress: {
                    drop_console: false
                },
                sourceMap: true
            },
            build: {
                src: 'dist/js/app.annotated.js',
                dest: 'dist/js/app.min.js'
            }
        },
        watch: {
            js: {
                files: javascriptSourceFiles,
                tasks: ['concat', 'ngAnnotate']
            },
            htmljs:{
                files: filesWatch,
                options: {
                    livereload: 1337
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app:{
                files: [
                    {
                        expand: true,
                        src: ['dist/js/app.js'],
                        ext: '.annotated.js', // Dest filepaths will have this extension.
                        extDot: 'last'       // Extensions in filenames begin after the last dot
                    },
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['concat', 'ngAnnotate', 'uglify']);
};
