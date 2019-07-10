/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalPagoDocumento", modalPagoDocumento);

    function modalPagoDocumento(){
        return {
            restrict: 'AE',
            scope:{
                elementid:'@',
                form:'=',
                ttransacc:'=',
                ttransaccpago:'=',
                fnguardar:'&'
            },
            controller: "ModalPagoDocumentoCntrl",
            templateUrl:"static/components/modal/pagos/modalPagoDocumento/modalPagoDocumento.html?v="+globalgsvapp
        }
    }

})();