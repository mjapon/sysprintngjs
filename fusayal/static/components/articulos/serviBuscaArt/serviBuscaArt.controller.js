/**
 * Created by serviestudios on 15/01/16.
 */
(function(module){
    'use strict';
    module.controller('ServiBuscaArtCntrl', ServiBuscaArtCntrl);

    function ServiBuscaArtCntrl($timeout, $element){
        var vm = this;

        //Atributos
        vm.uri = "";
        vm.uriParams = {};
        vm.model = {};
        vm.disabled = false;
        vm.modobus = "bynom";
        vm.tarcodigodef = 1;
        vm.tiposartlist = [
            {
              tar_codigo:1,
              tar_descri:'COMERCIAL',
              tipo:'arts'
            }
        ];

        vm.setup = {
            'propFiltro':'art_nomlar',
            'propFiltroId':'art_id',
            'idprop':vm.elementId,
            'colornull':'#FF0000',
            'fnOnSel':vm.onItemSel,
            'showClearBtn':1
        };

        //metodos
        setSetupAndUri();

        //definicion
        function setSetupAndUri(){
            //Verificar que se haya enviado como parametro valor para tracodigo
            if (!vm.tracodigo){
                vm.tracodigo = 0;
            }

            $timeout(function(){

                vm.uriParams = {
                    modo: 'bynom',
                    tra_codigo: vm.tracodigo,
                    tar_codigo: 1,
                    tra_tiplis: 0,
                    tipo:'arts'
                };

                vm.uri = "/rest/transacc/articulos?search";

                //Setear input de id con el valor indicado
                if (vm.elementId){
                    var input = $element.find("input");
                    input.attr("id",vm.elementId);
                }
            },500);
        }
    }
})(IsyplusApp);