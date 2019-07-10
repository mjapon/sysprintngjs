/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("NgSegridCntrl", NgSegridCntrl);

    function NgSegridCntrl($scope, $filter, $element){
        $scope.search = {};
        $scope.labelprop= 'label';
        $scope.valueprop= 'prop';
        $scope.totalprop = 'tot';
        $scope.cssrowexp = '';
        $scope.labelbtndet = 'Detalles';
        $scope.expbtndet = 'true';
        $scope.filtot = 'F';
        $scope.reverse = false;
        $scope.filtro = 'T';
        $scope.coldet = false;
        $scope.fillink = "";
        $scope.paginado = 'T';
        $scope.head='T';
        $scope.showtotal='T';

        //Propieades para botones de accion
        $scope.fnbtnsel = $scope.auxfnfila;
        $scope.fnbtnedit = $scope.auxfnfila;
        $scope.fnbtndel = $scope.auxfnfila;
        $scope.fnbtnadc = $scope.auxfnfila;

        $scope.labelbtnsel = "'Elegir'";
        $scope.labelbtnedit = "'Editar'";
        $scope.labelbtndel = "'Quitar'";
        $scope.labelbtnadc = "'Accion'";

        $scope.btnsel = false;
        $scope.btnedit = true;
        $scope.btndel = false;
        $scope.btnadc = false;

        $scope.icobtnsel = true;
        $scope.icobtnedit = true;
        $scope.icobtndel = true;

        $scope.currentdat = undefined;

        if ( $scope['colinfo'] ){
            if ( $scope['colinfo']['labelprop'] ){
                $scope.labelprop = $scope['colinfo']['labelprop'];
                $scope.valueprop = $scope['colinfo']['valueprop'];
            }

            if ( $scope.colinfo['totalprop'] ){
                $scope.totalprop = $scope.colinfo['totalprop'];
            }

            if ( $scope.colinfo['cssrowexp'] ){
                $scope.cssrowexp = $scope.colinfo['cssrowexp'];
            }

            if ( $scope.colinfo['labelbtnsel'] ){
                $scope.labelbtnsel = $scope.colinfo['labelbtnsel'];
            }

            if ( $scope.colinfo['btnsel'] ){
                $scope.btnsel = $scope.colinfo['btnsel'];
            }

            if ( $scope.colinfo['labelbtnedit'] ){
                $scope.labelbtnedit = $scope.colinfo['labelbtnedit'];
            }

            if ( $scope.colinfo['btnedit'] ){
                $scope.btnedit = $scope.colinfo['btnedit'];
            }

            if ( $scope.colinfo['labelbtndel'] ){
                $scope.labelbtndel = $scope.colinfo['labelbtndel'];
            }

            if ( $scope.colinfo['btndel'] ){
                $scope.btndel = $scope.colinfo['btndel'];
            }

            if ( $scope.colinfo['labelbtnadc'] ){
                $scope.labelbtnadc = $scope.colinfo['labelbtnadc'];
            }

            if ( $scope.colinfo['btnadc'] ){
                $scope.btnadc = $scope.colinfo['btnadc'];
            }

            if ( $scope.colinfo['filtot'] ){
                $scope.filtot = $scope.colinfo['filtot'];
            }

            if ( $scope.colinfo['filtro'] ){
                $scope.filtro = $scope.colinfo['filtro'];
            }

            if ( $scope.colinfo['head'] ){
                $scope.head = $scope.colinfo['head'];
            }

            if ( $scope.colinfo['paginado'] ){
                $scope.paginado = $scope.colinfo['paginado'];
            }

            if ( $scope.colinfo['icobtnedit'] ){
                $scope.icobtnedit = $scope.colinfo['icobtnedit'];
            }

            if ( $scope.colinfo['icobtndel'] ){
                $scope.icobtndel = $scope.colinfo['icobtndel'];
            }

            if ( $scope.colinfo['icobtnsel'] ){
                $scope.icobtnsel = $scope.colinfo['icobtnsel'];
            }
            if ( $scope.colinfo['showtotal'] ){
                $scope.showtotal= $scope.colinfo['showtotal'];
            }
        }

        $scope.colorder = '';
        $scope.reverse = false;
        $scope.pagobj = {'pagactual':0,
            'totpag':1,
            'totitems':0,
            'rto':0,
            'pagmodel':1,
            'nnfilas': $scope.filas,
            'inputpag':1};

        $scope.totales = {};

        if ($scope.colinfo['coldet']==='T'){
            $scope.coldet = true;
        }

        try{
            $scope.fnbtnsel = eval($scope.colinfo['fnbtnsel']);
        }
        catch(e){
            $scope.fnbtnsel = $scope.auxfnfila;
        }

        try{
            $scope.fnbtnedit = eval($scope.colinfo['fnbtnedit']);
        }
        catch(e){
            $scope.fnbtnedit = $scope.auxfnfila;
        }

        try{
            $scope.fnbtndel = eval($scope.colinfo['fnbtndel']);
        }
        catch(e){
            $scope.fnbtndel = $scope.auxfnfila;
        }

        try{
            $scope.fnbtnadc = eval($scope.colinfo['fnbtnadc']);
        }
        catch(e){
            $scope.fnbtnadc = $scope.auxfnfila;
        }

        try{
            $scope.fnrow = eval($scope.colinfo['fnrow']);
            if ( 'fnrow' in $scope.colinfo){
                $scope.fillink = "cursor: pointer; cursor: hand;";
            }
            else{
                $scope.fillink = "";
            }
        }
        catch(e){
            $scope.fnrow = $scope.auxfnfila;
        }

        $scope.onfilter = function(){
            var queryData = $filter('filter')($scope.datos, $scope.search);
            $scope.currentdat = queryData;
            $scope.calcularNumPag();
        };

        $scope.limpiarFiltro = function(){
            $scope.search = {};
            $scope.onfilter();
        };

        $scope.auxfnfila = function(fila){
            alert('Aux fila');
        };

        $scope.$watchCollection("datos",
            function( newValue, oldValue ) {
                $scope.search = {};
                $scope.currentdat = newValue;
                $scope.calcularNumPag();
            }
        );

        $scope.filasops = [ {'id':5, 'label':5},
            {'id':10, 'label':10},
            {'id':25, 'label':25},
            {'id':50, 'label':50},
            {'id':100, 'label':100}];

        $scope.crto = function(){
            var rto = ($scope.pagobj.pagactual+1)*$scope.pagobj.nnfilas;
            $scope.pagobj.rto =  Math.min( $scope.pagobj.totitems,  rto);
            $scope.pagobj.inputpag = ( $scope.pagobj.pagactual+1 );
        };

        $scope.calcularNumPag= function(){
            var datos = $scope.currentdat;
            var totpag = 1;

            if ($scope.paginado=='F'){
                if (datos){
                    $scope.pagobj.nnfilas = datos.length;
                }
            }

            if ( datos ){
                totpag = Math.ceil( datos.length/ $scope.pagobj.nnfilas );
            }

            if ($scope.paginado=='T'){
                $scope.pagobj.totpag = totpag;
            }
            else{
                $scope.pagobj.totpag = 1;
            }

            $scope.pagobj.pagactual = 0;
            $scope.pagobj.totitems = datos.length;

            $scope.crto();
        };

        $scope.setColOrder= function(col){
            $scope.colorder = col;
            $scope.reverse = !$scope.reverse;
        };

        $scope.pfirst = function(){
            $scope.pagobj.pagactual = 0;
            $scope.crto();
        };

        $scope.plast = function(){
            $scope.pagobj.pagactual = $scope.pagobj.totpag-1;
            $scope.crto();
        };

        $scope.pnext = function(){
            if ( $scope.pagobj.pagactual < $scope.pagobj.totpag-1 ) {
                $scope.pagobj.pagactual = $scope.pagobj.pagactual + 1;
                $scope.crto();
                $('html, body').animate({
                    scrollTop: $element.offset().top
                }, 250);
            }
        };

        $scope.pback = function(){
            if ( $scope.pagobj.pagactual > 0 ){
                $scope.pagobj.pagactual = $scope.pagobj.pagactual-1;
                $scope.crto();
                $('html, body').animate({
                    scrollTop: $element.offset().top
                }, 250);
            }
        };

        $scope.setNumPag = function(){
            try{
                if ( $scope.pagobj.inputpag>0 && $scope.pagobj.inputpag<=$scope.pagobj.totpag ){
                    $scope.pagobj.pagactual = ($scope.pagobj.inputpag-1);
                }
                else{
                    alert("Valor incorrecto");
                }
            }
            catch(e){
                console.log("Error al setear pagina");
                console.log(e);
            }
        };

        $scope.evalExpress= function(fil, express){
            var fil = fil;
            var res = '';
            try{
                res = eval(express);
            }
            catch(e){
                res = express;
            }
            return res;
        };

        $scope.get_col_align = function(col_value){
            var return_val = "text-left";
            if ($.isNumeric(col_value) ){
                return_val = "text-right";
            }
            return return_val;
        }
    }
})();