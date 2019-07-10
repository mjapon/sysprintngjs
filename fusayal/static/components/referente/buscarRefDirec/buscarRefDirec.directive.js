/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("buscarRefDirec", buscarRefDirec);

    function buscarRefDirec(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@',
                referente:'=',
                onreffind:'&',
                onrefnull:'&',
                onreflista:'&',
                disabled:'=',
                trarefdoc:'=',//Permite validar el tipo de documento que se ingresa
                placeholder:'=?'
            },
            controller:"BuscarRefDirecCntrl",
            templateUrl:'static/components/referente/buscarRefDirec/buscarRefDirec.html?v='+globalgsvapp
        }
    }

})();