/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("rangoFechasAnio", rangoFechasAnio);

    function rangoFechasAnio(){
        return {
            restrict: 'E',
            scope:{
                form:"=",
                setup:"=",
                disabled:"="
            },
            controller: "rangoFechasAnioCntrl",
            templateUrl:"static/components/rfechas/rangoFechasAnio/rangoFechasAnio.html?v=" + globalgsvapp
        }
    }
})();