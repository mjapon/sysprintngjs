/**
 * Created by serviestudios on 07/04/16.
 */
(function (module) {
    'use strict';

    module.controller("ServiTrnResCntrl", ServiTrnResCntrl);

    function ServiTrnResCntrl($resource, $scope){
        var self = this;
        var viewResumenRest = $resource("/rest/transacc/resumen/:trn_codigo", {trn_codigo:'@trn_codigo'},{});

        $scope.$watch("self.trncodigo", watchTrnCodigo);


        function watchTrnCodigo(newValue, oldValue){
            console.log("Cambio trn_codigo traer datos del servidor--->", newValue, oldValue);
            if ((newValue)||newValue===0){
                var res = viewResumenRest.get({trn_codigo:newValue}, function() {
                    console.log("valor para res es:");
                    console.log(res);
                });
            }
        }
    }


})(IsyplusApp);