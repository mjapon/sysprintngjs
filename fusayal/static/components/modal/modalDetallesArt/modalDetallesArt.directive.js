/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalDetallesArt", modalDetallesArt);

    function modalDetallesArt(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@'
            },
            controller: "ModalDetallesArtCntrl",
            templateUrl:"static/components/modal/modalDetallesArt/modalDetallesArt.html?v="+globalgsvapp
        }
    }
})();