/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngOpcbusq", ngOpcbusq);

    function ngOpcbusq($timeout){
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: "static/components/ui/ngOpcbusq/ngOpcbusq.html?v=" + globalgsvapp,
            scope:{
                filtros:'=',
                listaopc:'=',
                parametros:'=',
                listatdocs:'=',
                opciondoc:'=',
                fncbusq:'=',
                ini:'=',
                funasignardoc:'=',
                funcfil:'=',
                lstitbusq:'=',
                titdoc:'@',
                fnonchangefecha:'='
            },
            link: function($scope, $elem, $attrs){
                //$scope.listatdocs= $scope.listatdocs ||[];
                $scope.titbusq="Busquedas por: ";
                $scope.opendocs = false;
                $scope.searchFilter = $scope.searchFilter || '';
                $scope.buscarDocs = $scope.buscarDocs || '';

                $scope.$watchCollection(
                    "listaopc",
                    function( newLst, oldLst ) {
                        if(newLst.length===0){//limpiar titbusq cuando lista es vacia
                            $scope.limpiartitbusq();
                        }
                    }
                );
                $scope.inicializar =function(lt){
                    for (var n=0;n<lt.length;n++ ) {
                        lt[n].sel=false;
                    }
                    $scope.opendocs = false;
                    $scope.concatTitbusq();
                };
                $scope.limpiartitbusq=function(tipo , index){
                    var ban=false;

                    if(  index ){
                        ban=true;
                        if(($scope.filtros[index].tipo==="select" ||
                            $scope.filtros[index].tipo==="find" ||
                            $scope.filtros[index].tipo==="monto" ||
                            $scope.filtros[index].tipo==="text"
                            ) &&$scope.listaopc[index]===1 ){
                            ban=false;
                        }
                    }
                    if(ban){
                        $scope.fncbusq()
                    }
                    $scope.concatTitbusq();
                }
                $scope.concatTitbusq=function(){
                    $scope.titbusq="Busquedas por : ";
                    for (var key in $scope.lstitbusq) {
                        if ($scope.lstitbusq[key]!=""){
                            $scope.titbusq=$scope.titbusq+$scope.lstitbusq[key]
                            $scope.titbusq=$scope.titbusq+" - "
                        }
                    }

                    $scope.titbusq=$scope.titbusq.substring(0, $scope.titbusq.length-3);//quitar el ultimo separador
                }

                $scope.$watchCollection(
                    "filtros.lstselect",
                    function( newLst, oldLst ) {
                    }
                );
                $scope.$watchCollection(
                    "filtros",
                    function( newLst, oldLst ) {
                    }
                );

                $scope.$watch(
                    "filtros.opcmodel",
                    function(newVal, oldVal){
                    }
                );

                $scope.$watch(
                    "parametros",
                    function(newVal, oldVal){
                    }
                );
                $scope.$watchCollection(
                    "lstitbusq",
                    function( newLst, oldLst ) {
                        $scope.concatTitbusq()
                    }
                )
                $scope.$watchCollection(
                    "listatdocs",
                    function( newLst, oldLst ) {
                        if(newLst){
                            for (var n=0;n<newLst.length;n++ ) {//seleccionar por defecto un tipo de documento
                                if(newLst[n].tra_codigo===$scope.opciondoc) {
                                    newLst[n].sel = true
                                }else{
                                    newLst[n].sel = false
                                }
                            }
                        }
                    }
                );
                $scope.foco = function(id){
                    $timeout(function() {
                        document.getElementById(id).focus();
                    });
                }
            }
        }
    }
})();