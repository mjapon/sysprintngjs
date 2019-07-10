/**
 * Created by serviestudios on 10/05/16.
 */
(function (module) {
    'use strict';
    module.directive("modalCmbNombreArts", modalCmbNombreArts);

    function modalCmbNombreArts(){
        return {
            restrict:'EA',
            replace:true,
            templateUrl: "static/components/transacc/modalCmbNombreArts/modalCmbNombreArts.html?v="+globalgsvapp,
            scope:true,
            bindToController: {
                elementid:"@",
                articulos:"="
            },
            controller:"ModalCmbNombreArtCntrl",
            controllerAs: "self"
        }
    }

})(IsyplusApp);