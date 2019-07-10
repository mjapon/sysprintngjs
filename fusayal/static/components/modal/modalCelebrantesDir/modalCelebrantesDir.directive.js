/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalCelebrantesDir", modalCelebrantesDir);

    function modalCelebrantesDir(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@'
            },
            controller: "ModalCelebrantesDirCntrl",
            templateUrl:"static/components/modal/modalCelebrantesDir/modalCelebrantesDir.html?v="+globalgsvapp
        }
    }
})();