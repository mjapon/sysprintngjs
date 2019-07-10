/**
 * Created by serviestudios on 20/04/16.
 */
(function (module) {
    'use strict';

    module.directive("modalRetencion", modalRetencion);

    function modalRetencion(){
        return {
            restrict:'EA',
            replace: true,
            templateUrl: 'static/components/modal/modalRetencion/modalRetencion.html?v='+globalgsvapp,
            scope: true,
            bindToController:{
                elementid:'@',
                form:'=',
                fnguardar:'&'
            },
            controller: "ModalRetencionCntrl",
            controllerAs: "cntrl"
        }
    }

})(IsyplusApp);