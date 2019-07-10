/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('revisadoFechaFilter', revisadoFechaFilter);

    function revisadoFechaFilter(){
        return function(fecha){
            if (!fecha){
                return fecha;
            }

            var momment_now = moment(moment().format('DD/MM/YYYY'), "DD/MM/YYYY");
            var tipo_fecha = moment(fecha, "DD/MM/YYYY HH:mm");
            var aux_tipo_fecha = moment(tipo_fecha.format('DD/MM/YYYY'), "DD/MM/YYYY");
            var format_hora = "HH:mm";
            var format_dia_hora = "DD MMM HH:mm";
            var dif = momment_now.diff(aux_tipo_fecha, 'days');
            if (dif == 0){
                tipo_fecha
                return tipo_fecha.format(format_hora);
            }
            else{
                return tipo_fecha.format(format_dia_hora);
            }
        }
    }
})();