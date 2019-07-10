/**
 * Created by serviestudios on 25/01/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("serviConversionArt", serviConversionArt);

    function serviConversionArt(){
        var directive = {
            restrict: 'EA',
            templateUrl: 'static/components/articulos/serviConversionArt/serviConversionArt.html?v='+globalgsvapp,
            scope: true,
            bindToController:{
                elementid:'@',
                artCodequiv: '='
            },
            controller: "ServiConversionArtController",
            controllerAs: "cntrl"
        };
        return directive;
    }

})();