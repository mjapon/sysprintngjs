/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("modalPagoCredito", modalPagoCredito);

    function modalPagoCredito(){

        return {
            restrict: 'AE',
            scope:{
                elementid:'@',
                form:'=',
                fnguardar:'&',
                fnlistaref:'&'
            },
            controller: "ModalPagoCreditoCntrl",
            templateUrl:"static/components/modal/pagos/modalPagoCredito/modalPagoCredito.html?v="+globalgsvapp
        }

    }

})();