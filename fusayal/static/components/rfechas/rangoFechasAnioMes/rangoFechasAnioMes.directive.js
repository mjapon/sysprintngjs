/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("rangoFechasAnioMes", rangoFechasAnioMes);

    function rangoFechasAnioMes(){
        return {
            restrict: 'E',
            scope:{
                form:"=",
                setup:"=",
                disabled:"="
            },
            controller: "RangoFechasAnioMesCntrl",
            templateUrl:"static/components/rfechas/rangoFechasAnioMes/rangoFechasAnioMes.html?v=" + globalgsvapp
        }
    }

})();