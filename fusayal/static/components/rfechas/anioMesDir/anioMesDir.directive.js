/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("anioMesDir", anioMesDir);

    function anioMesDir(){
        return {
            restrict: 'E',
            scope:{
                form:"=",
                setup:"=",
                disabled:"="
            },
            controller: "AnioMesDirCntrl",
            templateUrl:"static/components/rfechas/anioMesDir/anioMesDir.html?v=" + globalgsvapp
        }
    }

})();