(function(module){
    'use strict';
    module.service("AlertSrv", AlertSrv);
    /**
     * @deprecated, usar 'swalService' en su lugar
     * @constructor
     */
    function AlertSrv(){
        this.confirm = function(text, func, closeconf, closecanc){
            swal({
                title: '',
                text: text,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                closeOnConfirm: close === undefined ? true : closeconf,
                closeOnCancel: close === undefined ? true : closecanc
            },func);
        };

        this.info = function(text, title,func){
            swal({
                title: title || 'Información',
                text: text,
                type: "info"
            },func);
        };
        this.success = function(text, title, func){
            swal({
                title: title || 'Éxito',
                text: text,
                type: "success"
            },func);
        };
        this.warning = function(text, title, func,closeconf){
            swal({
                title: title || 'Advertencia',
                text: text,
                type: "warning",
                closeOnConfirm: close === undefined ? true : closeconf
            },func);
        };
        this.error = function(text, title, func){
            swal({
                title: title || 'Error',
                text: text,
                type: "error"
            },func);
        };
        this.input = function(text, title,  func){
            swal({
                title: title || 'Error',
                text: text,   type: "input",
                showCancelButton: true,
                closeOnConfirm: true,
                animation: "slide-from-top"
            }, func);
        }
    }
})(IsyplusApp);