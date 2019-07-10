/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("anioDir", anioDir);

    function anioDir(){
        return {
            restrict: 'E',
            scope:{
                form:"=",
                setup:"=",
                disabled:"="
            },
            controller: "AnioMesDirCntrl",
            templateUrl:"static/components/rfechas/anioDir/anioDir.html?v=" + globalgsvapp
        }
    }

})();