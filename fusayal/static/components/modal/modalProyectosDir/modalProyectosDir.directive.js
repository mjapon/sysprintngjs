/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalProyectosDir", modalProyectosDir);

    function modalProyectosDir(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@'
            },
            controller: "ModalProyectosDirCntrl",
            templateUrl:"static/components/modal/modalProyectosDir/modalProyectosDir.html?v="+globalgsvapp
        }
    }

})();