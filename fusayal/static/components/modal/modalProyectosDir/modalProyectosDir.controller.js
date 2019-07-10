/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalProyectosDirCntrl", ModalProyectosDirCntrl);

    function ModalProyectosDirCntrl($scope, ModalServ, ModalProyectosService){
        $scope.proyectos = [];
        $scope.proyectosselecs = [];
        $scope.filtro_proy = {};
        $scope.current_pry_codigo = 0;
        $scope.load_proyectos = function(){
            ModalProyectosService.load_proyectos($scope);
        }
        $scope.sel_proyecto = function(proyecto) {
            if($scope.selecvarios){
                var ind = -1;
                proyecto.sel=!proyecto.sel;
                //verifica el indice del poryecto seleccioando
                for(var i in $scope.proyectosselecs) {
                    if($scope.proyectosselecs[i].pry_codigo === proyecto.pry_codigo){
                        ind = i;
                        break;
                    }
                };
                //agrega o elimina segun variable sel
                if (proyecto.sel ){
                    if(ind === -1){
                        $scope.proyectosselecs.push(proyecto);
                    }
                }else{
                    $scope.proyectosselecs.splice(ind, 1);
                }
            }else {
                $scope.$emit("on_centrocosto_sel", {proyecto: proyecto, otro: 'otro'});
                ModalServ.hide($scope.elementid);
            }
        };

        $scope.$on("show_modal_centrocosto", function(event, data){
            console.log("show_modal_centrocosto event----------------->");
            console.log(data)
            $('#'+$scope.elementid).off('show.bs.modal');
            $('#'+$scope.elementid).off('shown.bs.modal');
            $('#'+$scope.elementid).off('hide.bs.modal');
            $scope.current_pry_codigo = data['current']||0;
            $scope.selecvarios = data['selecvarios']||false;
            $scope.proyectosselecs = data['proyectosselecs']||[];
            $scope.pry_estado = data['pry_estado'];
            $scope.onhide = data['onhide']||false;
            if($scope.onhide ){
                ModalServ.onHide($scope.elementid, function(e){
                    $scope.onhide();
                });
            }
            ModalServ.onShow($scope.elementid, function(e){
                $scope.load_proyectos();
            });

            ModalServ.onShown($scope.elementid, function(e){
                $("#centro_costo_filter").focus();
            });
            ModalServ.show($scope.elementid);
        });

        $scope.cambiaEstado = function(){
            $scope.pry_estado = $scope.pry_estado === 0? 1:0;
            ModalProyectosService.load_proyectos($scope)
        };
    }

})();