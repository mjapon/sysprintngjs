/**
 * Created by Serviestudios on 1/09/14.
 */
'use strict';

module.exports = function (grunt) {

    //var path_bc = "isyplus2/static/bower_components";
    //var path_dist = "isyplus2/static/dist";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        rutas:{
            path_dist: "dist",
            path_bc: "bower_components",
            path_nm: "node_modules",
            root: "",
            path_templates: "templates/"
        },
        concat: {
            options:{
                sourceMap:true
            },
            javascript_vendor: {
                 src:[
                    '<%= rutas.path_bc %>/jquery/dist/jquery.js',
                    '<%= rutas.path_bc %>/angular/angular.js',
                    '<%= rutas.path_bc %>/angular-resource/angular-resource.js',
                    '<%= rutas.path_nm %>/@uirouter/angularjs/release/angular-ui-router.js',
                    '<%= rutas.path_bc %>/angular-ui-grid/ui-grid.min.js',
                    '<%= rutas.path_bc %>/bootstrap/dist/js/bootstrap.min.js',
                    '<%= rutas.path_bc %>/toastr/toastr.min.js',
                    '<%= rutas.path_bc %>/jquery.inputmask/dist/min/jquery.inputmask.bundle.min.js',
                    '<%= rutas.path_bc %>/angular-mask/dist/ngMask.min.js',
                    '<%= rutas.path_bc %>/moment/min/moment-with-locales.min.js',
                    '<%= rutas.path_bc %>/sweetalert/lib/sweet-alert.min.js',
                    '<%= rutas.path_bc %>/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
                    '<%= rutas.path_bc %>/bootstrap-calendar/js/language/es-ES.js',
                    '<%= rutas.path_bc %>/bootstrap-calendar/js/calendar.min.js',
                    '<%= rutas.path_bc %>/underscore/underscore-min.js',
                    '<%= rutas.path_bc %>/ngDraggable/ngDraggable.js',
                    '<%= rutas.path_bc %>/ng-file-upload/ng-file-upload.js',
                    '<%= rutas.path_bc %>/ng-file-upload/ng-file-upload-shim.js'
                ],
                dest: '<%= rutas.path_dist %>/js/vendor.js'
            },
            css_vendor:{
                src:[
                    '<%= rutas.path_bc %>/bootstrap/dist/css/bootstrap.min.css',
                    '<%= rutas.path_bc %>/angular-ui-grid/ui-grid.css',
                    '<%= rutas.path_bc %>/toastr/toastr.min.css',
                    '<%= rutas.path_bc %>/sweetalert/lib/sweet-alert.css',
                    '<%= rutas.path_bc %>/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css',
                    // '<%= rutas.path_bc %>/awesome-bootstrap-checkbox-master/build.css',
                    '<%= rutas.path_bc %>/bootstrap-calendar/css/calendar.min.css'
                ],
                dest: '<%= rutas.path_dist %>/css/vendor.css'
            },
            css_app:{

            }
        },
        uglify: {
            vendor: {
                 src: '<%= rutas.path_dist %>/js/vendor.js',
                dest: '<%= rutas.path_dist %>/js/vendor.min.js'
            }
        },
        cssmin : {
            vendor:{
                src: '<%= rutas.path_dist %>/css/vendor.css',
                dest: '<%= rutas.path_dist %>/css/vendor.min.css'
            },
            app:{
                src: 'css/app.css',
                dest: '<%= rutas.path_dist %>/css/app.min.css'
            }
        },
        filerev: {
            dist: {
              src: ["<%= rutas.path_dist %>/js/vendor.min.js",
                    "<%= rutas.path_dist %>/css/vendor.min.css",
                    "<%= rutas.path_dist %>/css/app.min.css"]
            }
        }
    });

    // Where we tell Grunt we plan to use some plug-ins.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-filerev');

    // Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
};
