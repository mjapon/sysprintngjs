/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngOpcproyecto", ngOpcproyecto);

    function ngOpcproyecto(){
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: "static/components/ui/ngOpcproyecto/ngOpcproyecto.html?v=" + globalgsvapp,
            scope:{
                params:"=",// Parametro donde seguardar la opcion de lso check si solo este local o todos
                setup:'=',
                lstproyectosselecs:'='
            },
            link: function($scope, $elem, $attrs){
                console.log("llega a ngOpcProyecto ")
                $scope.params.opclocal= $scope.params.opclocal? $scope.params.opclocal:1;
                $scope.show_modal_proyectos = function(){
                    setTimeout(function() {
                        $scope.$broadcast('show_modal_centrocosto', {selecvarios:true,
                            proyectosselecs: $scope.lstproyectosselecs,
                            pry_estado: 0,onhide: $scope.onChangeopclocal});
                        console.log("pasa show modal")
                    })
                }

                $scope.getProyectSelectCadena = function(){
                    var cad = '';
                    for (var ind in $scope.lstproyectosselecs){
                        cad= cad + $scope.lstproyectosselecs[ind].pry_codigo+',';
                    }
                    cad = cad.substring(0, (cad.length -1));
                    return cad;
                };

                $scope.$watch("params",function(newVal,oldVal){
                    if (newVal) {
                        console.log("llega new val de paramas")
                        $scope.params = newVal;
                        console.log($scope.params)
                    }
                })

                $scope.$watchCollection(
                    "lstproyectosselecs",
                    function( newLst, oldLst ) {
                        if (newLst) {
                            $scope.lstproyectosselecs = newLst;
                            $scope.params.proyectosselecs = $scope.getProyectSelectCadena();

                        }
                    }
                );
                $scope.$watch("setup",
                    function(newVal, oldVal){
                        if (newVal) {
                            if(newVal){
                                console.log("llega setup")
                                console.log(oldVal)
                                console.log(newVal)
                                $scope.setup = newVal;
                                $scope.alm_descri = newVal.alm_descri;
                                $scope.abremodal = newVal.abremodal;
                                //$scope.lstproyectosselecs = newVal.lstproyectosselecs;
                                $scope.onChangeopclocal = newVal.onChangeopclocal;
                                $scope.tituloproyecto = newVal.label;
                                $scope.params.proyectosselecs = $scope.getProyectSelectCadena();
                                if ($scope.params.acf_useproyecto ===1 && $scope.abremodal){
                                    $scope.show_modal_proyectos()
                                }if($scope.params.acf_useproyecto === 2){
                                    console.log("acf_useproyecto es 2")
                                    $scope.onChangeopclocal()
                                }
                            }
                        }
                    }
                );
            }
        }
    }
})();