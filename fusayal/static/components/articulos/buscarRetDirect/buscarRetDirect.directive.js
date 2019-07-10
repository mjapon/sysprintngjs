/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("buscarRetDirect", buscarRetDirect);

    function buscarRetDirect(){
        return {
            restrict: 'EA',
            scope:{
                tipo:'@',
                data:'=',
                model:'=',
                setup:'=',
                disabled:'='
            },
            controller:'BusRetDirectCntrl',
            templateUrl:"static/components/articulos/buscarRetDirect/buscarRetDirect.html?v=" + globalgsvapp
        }
    }
})();