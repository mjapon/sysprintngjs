/**
 * Created by serviestudios on 07/04/16.
 */
(function (module) {
    'use strict';

    module.directive("serviTrnResumen", serviTrnResumen);

    function serviTrnResumen(){
        return {
            restrict:'EA',
            replace: true,
            templateUrl: 'static/components/transacc/serviTrnResumen/serviTrnResumen.html?v='+ globalgsvapp,
            scope: true,
            bindToController: {
                trncodigo: '='
            },
            controller: "ServiTrnResCntrl",
            controllerAs: "self"
        }
    }

})(IsyplusApp);