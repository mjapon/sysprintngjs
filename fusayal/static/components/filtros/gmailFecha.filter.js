/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('gmailFechaFilter', gmailFechaFilter);

    function gmailFechaFilter(){
        return function(fecha, format){
            var momment_now = moment(moment().format('DD/MM/YYYY'), "DD/MM/YYYY");
            var tipo_fecha = moment(fecha, "ddd, DD MMM YYYY HH:mm:ss Z");
            var aux_tipo_fecha = moment(tipo_fecha.format('DD/MM/YYYY'), "DD/MM/YYYY");
            var format_hora = "HH:mm";
            var format_dia_hora = "DD MMM";
            var dif = momment_now.diff(aux_tipo_fecha, 'days');

            if (format){
                return tipo_fecha.format("DD MMM, HH:mm:ss a ");
            }
            else{
                if (dif == 0){
                    return tipo_fecha.format(format_hora);
                }
                else{
                    return tipo_fecha.format(format_dia_hora);
                }
            }
        }
    }


})();