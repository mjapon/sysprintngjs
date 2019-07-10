/**
 * Created by yesica on 23/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalSeccionesDir", modalSeccionesDir);

    function modalSeccionesDir(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@'
            },
            controller: "ModalSeccionesDirCntrl",
            templateUrl:"static/components/modal/modalSeccionesDir/modalSeccionesDir.html?v="+globalgsvapp
        }
    }

})();