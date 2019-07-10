/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalPagoGeneral", modalPagoGeneral);

    function modalPagoGeneral(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@',
                form:'=',
                fnguardar:'&'
            },
            controller: "ModalPagoGeneralCntrl",
            templateUrl:"static/components/modal/pagos/modalPagoGeneral/modalPagoGeneral.html?v="+globalgsvapp
        }
    }

})();