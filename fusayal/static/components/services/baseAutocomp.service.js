/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.service("BaseAutocompServ", BaseAutocompServ);

    function BaseAutocompServ($filter, $http, $timeout){

        this.config = function($scope){
            $scope.uri= '';//uri si ajax
            $scope.indexitem = -1;
            $scope.itemsel = {};
            $scope.filtro = {};
            $scope.idprop = 'autocompletado_' + Math.random();//Id del input
            $scope.csscolor = {'color':'#000000'};
            $scope.csscolornull = '#000000';
            $scope.filtrados = [];
            $scope.placeholder = "";
            $scope.auxfnsel = function(item){};
            $scope.propFiltro = "label";//La propiedad que debe filtrar el componente, y la que se muestra en el listado
            $scope.propFiltroId = "id";
            $scope.nomParamFiltroUri = "filtro";//Nombre del parametro en el uri que se agrega al hacer consulta ajax
            $scope.fnOnSel = $scope.auxfnsel; //funcion que se ejecuta cuando se selecciona el item
            $scope.fnOnNull = $scope.auxfnsel; //funcion que se ejecuta cuando el item queda desmarcado
            $scope.fnOnEnterNull = $scope.auxfnsel;//Se usa para el caso en que no haya ninguna sugerencia y se presione enter
            $scope.showClearBtn = 0;

            $scope.auxfnsel = function(itemsel){
                console.log("auxfnsel no definido, se ejectua la funcion por defecto.....!");
            }
            if ( $scope.setup['propFiltro'] ){
                $scope.propFiltro =  $scope.setup['propFiltro'];
            }
            if ( $scope.setup['propFiltroId'] ){
                $scope.propFiltroId =  $scope.setup['propFiltroId'];
            }
            if ( $scope.setup['placeholder'] ){
                $scope.placeholder =  $scope.setup['placeholder'];
            }
            if ( $scope.setup['uri'] ){
                $scope.uri = $scope.setup['uri'];
            }
            if ( $scope.setup['nomParamFiltroUri'] ){
                $scope.nomParamFiltroUri = $scope.setup['nomParamFiltroUri'];
            }
            if ( $scope.setup['fnOnSel'] ){
                $scope.fnOnSel = eval($scope.setup['fnOnSel']);
            }
            if ( $scope.setup['fnOnNull'] ){
                $scope.fnOnNull = eval($scope.setup['fnOnNull']);
            }
            if ( $scope.setup['fnOnEnterNull'] ){
                $scope.fnOnEnterNull = eval($scope.setup['fnOnEnterNull']);
            }
            if ( $scope.setup['idprop'] ){
                $scope.idprop = $scope.setup['idprop'];
            }
            if ( $scope.setup['colornull'] ){
                $scope.csscolornull= $scope.setup['colornull'];
            }
            if ( $scope.setup['showClearBtn'] ){
                $scope.showClearBtn= $scope.setup['showClearBtn'];
            }
        }

        this.nav_items_sugg = function($scope, inc){
            $scope.indexitem = $scope.indexitem+inc;
            $scope.itemsel = $scope.filtrados[$scope.indexitem];
        }

        this.onkeydown = function($scope, event){
            if (event.keyCode == 38) {//UP
                event.preventDefault();
                if ( $scope.indexitem > 0 ){
                    this.nav_items_sugg($scope, -1);
                }
            }
            else if(event.keyCode == 40) {//DOWN
                event.preventDefault();
                if ( ($scope.indexitem+1) < $scope.filtrados.length ){
                    this.nav_items_sugg($scope, +1);
                }
            }
            else if(event.keyCode == 13) {//ENTER
                event.preventDefault();
                if ($scope.itemsel[$scope.propFiltro]){
                    this.sel_item($scope, $scope.itemsel);
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
                event.preventDefault();
                $scope.filtrados = [];
                this.logica_filtrados($scope);
            }
            else if( (event.keyCode == 46) || (event.keyCode == 8) ) {//SUPR O DELETE
                //event.preventDefault();
                //$scope.listener_null();
                if ($scope.tipo=='n'){
                    $scope.filtrados = $filter('filter')($scope.data, $scope.filtro, function (actual, expected) {
                        //return actual.toLowerCase().indexOf(expected.toLowerCase()) == 0;
                        return actual.toLowerCase().indexOf(expected.toLowerCase()) >= 0;
                    });
                    this.logica_filtrados($scope);
                }
            }
        }

        this.onkeyup = function($scope, event){
            if ( (event.keyCode >= 65 && event.keyCode <= 90) ||
                (event.keyCode >= 48 && event.keyCode <= 57) ||
                (event.keyCode >= 96 && event.keyCode <= 105) ||
                (event.keyCode == 46) || (event.keyCode == 8) ){//Teclado numerico
                //event.preventDefault();
                if ( $scope.tipo=='x' ){
                    this.do_ajax($scope);
                }
                else if ($scope.tipo=='n'){
                    $scope.filtrados = $filter('filter')($scope.data, $scope.filtro,function (actual, expected) {
                        //return (actual||'').toLowerCase().indexOf((expected||'').toLowerCase()) == 0;
                        return (actual||'').toLowerCase().indexOf((expected||'').toLowerCase()) >= 0;
                    });
                    this.logica_filtrados($scope);
                }
            }
        }

        this.sel_item = function($scope, item){
            $scope.model = item;
            try{//Evaluar funcion listener
                $timeout(function(){
                    $scope.fnOnSel(item);
                });
            }
            catch(e){
                console.error(" Error al ejecutar función ");
            }
        }

        this.do_ajax = function($scope){
            var filtro = $scope.filtro[$scope.propFiltro]||'';
            var uri = $scope.uri+"&"+$scope.nomParamFiltroUri+"="+filtro;
            var self = this;
            $http.get(uri).then(function(response){
                if (response.data['items']){
                    $scope.filtrados = response.data['items'];
                    self.logica_filtrados($scope);
                }
            });
        }
        this.do_ajax_with_fnthen = function($scope, fnthen){
            var filtro = $scope.filtro[$scope.propFiltro]||'';
            var uri = $scope.uri+"&"+$scope.nomParamFiltroUri+"="+filtro;
            $http.get(uri).then(fnthen);
        }

        this.filtro_to_model = function($scope){
            $scope.model[$scope.propFiltro] = $scope.filtro[$scope.propFiltro];
        }

        this.model_to_filtro = function($scope){
            $scope.filtro[$scope.propFiltro] = $scope.model[$scope.propFiltro];
        }

        this.on_lost_focus = function($scope){
            var self = this;
            $timeout(function(){
                self.model_to_filtro($scope);
                $scope.filtrados = [];
            }, 500);
        }

        this.logica_filtrados = function($scope){
            var nfiltrados = $scope.filtrados.length;
            if( nfiltrados >0 ){
                $scope.csscolor = {'color':'#000000'};//Se pono color de texto negro
                $scope.itemsel = $scope.filtrados[0];
                $scope.indexitem = 0;
            }
            else{
                $scope.csscolor = {'color':$scope.csscolornull};//Se pone color de texto rojo si
                this.listener_null($scope);
            }
        }

        this.listener_null = function($scope){
            $scope.model = {};
            this.filtro_to_model($scope);

            try{//Evaluar funcion listener
                $timeout(function(){
                    $scope.fnOnNull($scope.filtro);
                });
            }
            catch(e){
                console.error(" Error al ejecutar función ")
            }
        }

        this.on_model_change = function($scope){
            this.model_to_filtro($scope);
            $scope.indexitem = -1;
            $scope.itemsel = {};
            $scope.filtrados = [];
        }

        this.on_uri_change = function($scope){
            //console.log("on_uri_change->");
            //console.log($scope.uri);
        }
    }

})(IsyplusApp);