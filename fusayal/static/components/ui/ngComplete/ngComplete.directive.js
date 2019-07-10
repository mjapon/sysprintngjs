/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngComplete", ngComplete);

    function ngComplete($filter, $timeout, $http){
        return {
            restrict: 'E',
            templateUrl: "static/components/ui/ngComplete/ngComplete.html?v="+ globalgsvapp,
            scope: {
                lstdatos: '=',
                model: '=',
                func: '=',
                funcchg: '=',
                required: '=',
                filtro: '@',
                url:'@',
                placeholder: '@',
                vertitle :'=',
                group: '=',
                disabled: '=',//Permite desactivar el campo de autocompletado
                elementid: '@'//input html id
            },

            link: function(scope, element, attributes){

                scope.form = {};
                scope.form.lstdatos = [];
                scope.form.lstaux = [];
                scope.form.indice = 0;
                scope.form.busqueda = '';
                scope.form.funcejec = false; // variable que indica cuando se ha ejecutado la funcion asociada
                scope.form.borrado = false; // variable que indica si se ha borrado algo en el campo de busqueda
                scope.form.tipfilt = 1 // por defecto por palabras
                scope.form.nomfilt = 'Filtro';

                setElementId();

                function setElementId(){
                    if (scope.elementid===undefined){
                        scope.elementid = "ngcomplete";
                    }
                }

                if (scope.group) {
                    if (scope.group.dropdown) {
                        scope.form.tipfilt = scope.group.dropdown[0].codigo;
                        scope.form.nomfilt = scope.group.dropdown[0].label;
                    }
                }

                scope.checkKeyDown = function(event){
                    // se ejecuta dentro de un keydown porque no siempre se ejecuta en un keyup
                    if(event.keyCode===13){ //tecla enter
                        event.preventDefault();
                        if (scope.model){
                            if (Object.keys(scope.model)){
                                if (Object.keys(scope.model).length === 0){
                                    scope.setModel(scope.form.indice);
                                }
                            }
                        }
                        /*
                        if (Object.keys(scope.model).length === 0) {
                            scope.setModel(scope.form.indice);
                        }
                        */
                    }
                }

                scope.checkKeyUp = function(event){
                    scope.form.funcejec = false;
                    scope.form.borrado = false;
                    if(event.keyCode===40){ // flecha abajo
                        event.preventDefault();
                        if(scope.form.indice+1 !== scope.form.lstaux.length){
                            scope.form.indice++;
                        }
                    } else if(event.keyCode===38){ //flecha arriba
                        event.preventDefault();
                        if(scope.form.indice -1 !== -1){
                            scope.form.indice--;
                        }
                    } else if(event.keyCode===13){ //tecla enter
                        event.preventDefault();
                        if (scope.model){
                            if (Object.keys(scope.model)){
                                if (Object.keys(scope.model).length === 0){
                                    scope.setModel(scope.form.indice);
                                }
                            }
                        }
                        /*
                        if (Object.keys(scope.model).length === 0) {
                            scope.setModel(scope.form.indice);
                        }
                        */
                    }
                    else if (scope.form.busqueda && scope.form.busqueda.length > 0) { // si el campo de busqueda no esta vacio
                        scope.getNewList();
                        if (event.keyCode === 8 || event.keyCode === 46) { // delete o backspace
                            scope.form.borrado = true;
                        }
                    } else { //para que no se muestre la lista cuando el campo de busqueda esta vacio
                        scope.resetear();
                    }
                    if (scope.funcchg) {
                        $timeout(function(){
                            scope.funcchg();
                        },0);
                    }
                };

                scope.setModel = function(i){
                    if (scope.form.lstaux.length > 0) { // si hay elementos en la lista
                        scope.model = scope.form.lstaux[i];
                        scope.form.busqueda = scope.model[scope.filtro];
                        scope.form.lstaux = [];
                        scope.form.indice = 0;
                        if (scope.func) { //si hay funcion
                            $timeout(function() { // para evitar error en consola con el $apply
                                scope.form.funcejec = true;
                                scope.func(scope.model);
                            }, 0);
                        }
                    } else if(scope.form.busqueda !== scope.model[scope.filtro]){ //si el texto de busqueda no es igual al texto de filtro
                        scope.resetear();
                    }
                };

                scope.getNewList = function(){
                    if (scope.url && scope.form.lstdatos.length === 0) {
                        $http.get(scope.url+'&filtro='+scope.form.busqueda+"&tipfilt="+scope.form.tipfilt).then(function(rpta){
                            scope.form.lstaux = rpta.data.items;
                            scope.form.indice = 0;
                        });
                    } else if (scope.form.lstdatos.length > 0){
                        scope.form.lstaux = $filter('filter')(scope.form.lstdatos, scope.form.busqueda);
                        //scope.form.lstaux = $filter('startWith')(scope.form.lstdatos, scope.form.busqueda, scope.filtro);

                        if (scope.form.indice >= scope.form.lstaux.length) {
                            scope.form.indice = 0;
                        }
                    }

                    if (scope.form.lstaux.length === 0) { // si la lista auxiliar generada es vacia
                        scope.resetear();
                    }
                    // si hay modelo asignado y el campo de busqueda no es igual al campo en el modelo que corresponde al filtro
                    if (scope.model && scope.form.busqueda !== scope.model[scope.filtro]) {
                        scope.model = {};
                    }
                };
                scope.$watchCollection(
                    "lstdatos",
                    function( newLst, oldLst) {
                        if (scope.lstdatos && newLst) {
                            scope.form.lstdatos = newLst;
                        }
                    }
                );
                scope.$watch(
                    "model",
                    function(newVal, oldVal){
                        if (newVal && oldVal && newVal[scope.filtro] !== oldVal[scope.filtro]) {
                            if (!newVal[scope.filtro] && scope.form.funcejec) { // si no hay valor en el modelo de acuerdo al filtro y se a ejecutado la funcion asociada
                                scope.form.busqueda = '';
                            }
                            // para que se limpie el campo cuando se edita en asiento
                            else if (!newVal[scope.filtro]) {
                                if (scope.form.borrado === false) {
                                    scope.form.busqueda = '';
                                }
                            }
                        }
                        if (newVal && oldVal && newVal[scope.filtro]) { // para cuando se asigna el objeto de nuevo desde el controller
                            var i = scope.existObj(newVal);
                            if (i !== -1) {
                                scope.model = scope.form.lstdatos[i];
                                scope.form.busqueda = scope.model[scope.filtro];
                                scope.form.lstaux = [];
                                scope.form.indice = 0;
                            }
                            if (scope.url) {
                                scope.form.busqueda = scope.model[scope.filtro];
                                scope.form.lstaux = [];
                                scope.form.indice = 0;
                            }
                        }
                    }
                );

                scope.existObj = function(obj){
                    if (scope.form.lstdatos && obj !== undefined) {
                        for (var i in scope.form.lstdatos) {
                            if (angular.equals(obj, scope.form.lstdatos[i])) {
                                return i;
                            }
                        }
                    }
                    return -1;
                };

                scope.resetear = function(){
                    scope.form.lstaux = [];
                    scope.model = {};
                    scope.form.indice = 0;
                };

                scope.onclickFiltro = function(lbl, cod){
                    scope.form.tipfilt = cod; // codigo del filtro para buscar en el dao
                    scope.form.nomfilt = lbl; // nombre del filtro
                };
            }
        }
    }
})();