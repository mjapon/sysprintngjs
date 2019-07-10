/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("propiedadAdcDir", propiedadAdcDir)
    function propiedadAdcDir(){
        return {
            restrict: 'EA',
            replace: false,
            scope:{
                form:"=",
                fnvisiblegendescri: "=",
                fndisabled: "=",
                fnchange: "="
            },
            controller: "PropiedadAdcDirCntrl",
            templateUrl:"static/components/camposadc/propiedadAdcDir/propiedadAdcDir.html?v=" + globalgsvapp
        }
    }
})();