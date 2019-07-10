/**
 * Created by serviestudios on 18/01/16.
 */
(function(module){
    'use strict';
    module.factory("swalService", swalService);

    function swalService(){
        var service  = {
            success: success,
            warning: warning,
            error: error,
            info: info,
            confirm: confirm
        };

        return service;

        function getSwalConfig(title, text, type){
            return {
                title: title||'Éxito',
                text: text||'',
                type: type
            }
        }

        function success(text, fnthen, title){
            swal(
                getSwalConfig(title||"Éxito", text, "success"),
                fnthen
            );
        }

        function warning(text, fnthen, title){
            swal(
                getSwalConfig(title||"Precaución", text, "warning"),
                fnthen
            );
        }

        function error(text, fnthen, title){
            swal(
                getSwalConfig(title||"Error", text, "error"),
                fnthen
            );
        }

        function info(text, fnthen, title){
            swal(
                getSwalConfig(title||"Información", text, "info"),
                fnthen
            );
        }

        /**
         *
         * @param title
         * @param text
         * @param fnthen debe ser function(isConfirm)
         */
        function confirm(text, fnthen, title){
            swal({
                title: title||"¿Está seguro?",
                text: text || '',
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "OK",
                cancelButtonText: "Cancelar",
                closeOnConfirm: true,
                closeOnCancel: true
            }, fnthen);

        }
    }

})(IsyplusApp);