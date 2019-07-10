/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("NgAutocompCntrl", NgAutocompCntrl);

    function NgAutocompCntrl($scope, $element, $attrs, $filter, $http, $timeout){
        $scope.tipo='n';//1-normal, 2-ajax
        $scope.uri= '';//uri si ajax
        $scope.indexitem = -1;
        $scope.itemsel = {};
        $scope.filtro = {};
        $scope.idprop = 'autocompletado';//Id del input
        $scope.csscolor = {'color':'#000000'};
        $scope.csscolornull = '#FF0000';
        $scope.filtrados = $scope.data;
        $scope.justone = 'F';
        $scope.nomoreajax = false;

        $scope.placeholder = "";
        $scope.auxfnsel = function(item){};
        $scope.propFiltro = "label";
        $scope.fnSelItem = $scope.auxfnsel;
        $scope.fnOnNull = $scope.auxfnsel;
        $scope.fnOnEnterNull = $scope.auxfnsel;//Se usa para el caso en que no haya ninguna sugerencia y se precione enter

        if ( $scope.setup['propFiltro'] ){
            $scope.propFiltro =  $scope.setup['propFiltro'];
        }

        $scope.labelExp = "item."+$scope.propFiltro;
        if ( $scope.setup['labelExp'] ){
            $scope.labelExp = $scope.setup['labelExp'];
        }

        if ( $scope.setup['uri'] ){
            $scope.uri = $scope.setup['uri'];
        }

        if ( $scope.setup['placeholder'] ){
            $scope.placeholder = $scope.setup['placeholder'];
        }

        if ( $attrs['tipo'] ){
            $scope.tipo = $attrs['tipo'];
        }

        if ( $scope.setup['fnonsel'] ){
            $scope.fnSelItem = eval($scope.setup['fnonsel']);
        }

        if ( $scope.setup['fnonnull'] ){
            $scope.fnOnNull = eval($scope.setup['fnonnull']);
        }

        if ( $scope.setup['fnOnEnterNull'] ){
            $scope.fnOnEnterNull = eval($scope.setup['fnOnEnterNull']);
        }

        if ( $scope.setup['idprop'] ){
            $scope.idprop = $scope.setup['idprop'];
        }

        if ( $scope.setup['jo'] ){
            $scope.justone = $scope.setup['jo'];
        }

        if ( $scope.setup['colornull'] ){
            $scope.csscolornull= $scope.setup['colornull'];
        }

        $element.find(".suggestbox").hide();
        $element.find(".form-control").bind('blur', function(event) {
            $scope.filtrados = [];
        });

        $scope.modelToFiltro = function(){
            $scope.filtro[$scope.propFiltro] = $scope.model[$scope.propFiltro];
        };

        $scope.conf_posancho = function(show){
            var input = $element.find(".input-groupdd");
            var offset = input.offset();
            var altoinput = input.outerHeight();
            var anchoinput = input.css("width");
            offset['top']= offset['top']+altoinput;
            var suggest = $element.find(".suggestbox");
            suggest.offset( offset );
            suggest.css("width",  anchoinput);

            if (show){
                suggest.show();
            }
            else{
                suggest.hide();
            }
        };

        $scope.sel_item = function(item){
            $scope.csscolor = {'color':'#000000'};
            //$scope.model = {};
            $scope.model = item;
            $scope.filtrados = [];
            $scope.indexitem = -1;
            $scope.itemsel = {};
            $scope.nomoreajax = false;

            try{//Evaluar funcion listener
                $timeout(function(){
                    $scope.fnSelItem(item);
                });
            }
            catch(e){
                console.error(" Error al ejecutar función ");
            }
        };

        $scope.listener_null = function(filtro){
            $scope.indexitem = -1;
            $scope.itemsel = {};
            $scope.model = {};
            $scope.model = $scope.filtro;
            $scope.nomoreajax = false;
            try{//Evaluar funcion listener
                $timeout(function(){
                    $scope.fnOnNull(filtro);
                });
            }
            catch(e){
                console.error(" Error al ejecutar función ")
            }
        };

        $scope.logica_filtrados = function(isAjax){
            var nfiltrados = $scope.filtrados.length;
            if( nfiltrados >0 ){
                $scope.csscolor = {'color':'#000000'};
                if ( (nfiltrados == 1) && ($scope.justone=='T') ){
                    $scope.sel_item($scope.filtrados[0]);
                }
                else if ( ($scope.filtro[$scope.propFiltro]) && ($scope.filtro[$scope.propFiltro].length>0) ){
                    $scope.itemsel = $scope.filtrados[0];
                    $scope.indexitem = 0;
                }
                else{
                    $scope.indexitem = -1;
                    $scope.itemsel = {};
                }
            }
            else{
                $scope.csscolor = {'color':$scope.csscolornull};
                $scope.listener_null($scope.filtro);
                if (isAjax){
                    $scope.nomoreajax=true;
                }
            }
        };

        $scope.doAjax = function(){
            if (!$scope.nomoreajax){
                var uri = $scope.uri+"&filtro="+$scope.filtro[$scope.propFiltro];
                $http.get(uri).then(function(response){
                    if (response.data['items']){
                        $scope.filtrados = response.data['items'];
                        $scope.logica_filtrados(true);
                    }
                });
            }
            else{
                $scope.listener_null($scope.filtro);
            }
        };

        $scope.nav_items_sugg = function(inc){
            $scope.indexitem = $scope.indexitem+inc;
            $scope.itemsel = $scope.filtrados[$scope.indexitem];
        };

        $scope.evalExpress= function(item, express){
            var item = item;
            var res = '';
            try{
                res = eval(express);
            }
            catch(e){
                res = $scope.label;
            }
            return res;
        };

        $scope.onkeydown = function(event){
            $scope.conf_posancho(true);
            if (event.keyCode == 38) {//UP
                if ( $scope.indexitem > 0 ){
                    $scope.nav_items_sugg(-1);
                }
            }
            else if(event.keyCode == 40) {//DOWN
                if ( ($scope.indexitem+1) < $scope.filtrados.length ){
                    $scope.nav_items_sugg(+1);
                }
            }
            else if(event.keyCode == 13) {//ENTER
                if ($scope.itemsel[$scope.propFiltro]){
                    $scope.sel_item($scope.itemsel);
                }
                else {
                    try{//Evaluar funcion listener
                        $scope.fnOnEnterNull();
                    }
                    catch(e){
                        console.error(" Error al ejecutar función ");
                    }
                }
            }
            else if (event.keyCode == 27){//escape
                $scope.indexitem = -1;
                $scope.itemsel = {};
                $scope.filtrados = [];
            }
            else if( (event.keyCode == 46) || (event.keyCode == 8) ) {//SUPR O DELETE
                $scope.listener_null($scope.filtro);
                $scope.nomoreajax = false;
                if ($scope.tipo=='n'){
                    $scope.filtrados = $filter('filter')($scope.data, $scope.filtro, function (actual, expected) {
                        return actual.toLowerCase().indexOf(expected.toLowerCase()) == 0;
                    });
                }
            }
        };

        $scope.onkeyup = function(event){
            $scope.conf_posancho(true);
            if ( (event.keyCode >= 65 && event.keyCode <= 90) ||
                (event.keyCode >= 48 && event.keyCode <= 57) ||
                (event.keyCode >= 96 && event.keyCode <= 105) ){//Teclado numerico
                if ( $scope.tipo=='x' ){
                    $scope.doAjax();
                }
                else if ($scope.tipo=='n'){
                    $scope.filtrados = $filter('filter')($scope.data, $scope.filtro,function (actual, expected) {
                        return actual.toLowerCase().indexOf(expected.toLowerCase()) == 0;
                    });
                    $scope.logica_filtrados(false);
                }
            }
        };

        $scope.limpiar = function(){
            $scope.filtro[$scope.propFiltro] = '';
            $scope.listener_null();
            $("#"+$scope.idprop).focus();
        };
        $scope.$watch("model",
            function( newValue, oldValue ) { $scope.modelToFiltro(); }
        );

        $scope.conf_posancho(false);
    }

})();