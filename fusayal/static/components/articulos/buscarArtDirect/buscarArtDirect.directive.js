/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.directive("buscarArtDirect", buscarArtDirect);

    function buscarArtDirect(){
        return {
            restrict: 'EA',
            scope:{
                tipo:'@',//tipo ajax o normal x o n
                data:'=?',//lista de datos para el caso tipo normal
                model:'=',//el objeto que cambia cuando selecciona de la lista
                /**
                 * Propiedades adiciones para el autocompletado debe ser tipo
                 * {'propFiltro':'art_nomlar',
                    'propFiltroId':'art_id',
                    'idprop':'art_trn',
                    'colornull':'#FF0000',
                    'fnOnSel':on_articulo_sel,
                    'fn_detalles_art':ver_detalles_art}
                 */
                setup:'=',
                baseuri:'=',//uri rest para el caso de tipo ajax
                /**
                 * (opc)Se Agrega soporte de paso de parametros, debe ser tipo:
                 * {isSecCodigo:0, sec_codigo:0, tar_codigo:0, modo:byid o bynom }
                 */
                uriparams: '=?',

                //tarcodigo:'=',
                tiposartlist:'=',//Lista de tipos de articulos disponibles que se muestra para cambio de tipo de articulo
                disabled:'=',
                //modobus:'=',


                placeh:'@'

            },
            controller: "BusArtDirectCntrl",
            templateUrl:"static/components/articulos/buscarArtDirect/buscarArtDirect.html?v=" + globalgsvapp
        }
    }
})(IsyplusApp);