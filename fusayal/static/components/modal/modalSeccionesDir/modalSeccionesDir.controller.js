/**
 * Created by yesica on 23/02/16.
 */

(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalSeccionesDirCntrl", ModalSeccionesDirCntrl);

    function ModalSeccionesDirCntrl($scope, ModalServ, ModalSeccionesService){
        $scope.secciones = [];
        $scope.seccionesselecs = [];
        $scope.filtro_secc = {};
        $scope.session_sec_codigo  = 0;
        $scope.load_secciones = function(){
            ModalSeccionesService.load_secciones($scope);
        }
        $scope.sel_seccion = function(seccion) {
            if($scope.selecvarios){
                var ind = -1;
                seccion.sel=!seccion.sel;
                //verifica el indice del poryecto seleccioando
                for(var i in $scope.seccionesselecs) {
                    if($scope.seccionesselecs[i].pry_codigo === seccion.pry_codigo){
                        ind = i;
                        break;
                    }
                };
                //agrega o elimina segun variable sel
                if (seccion.sel ){
                    if(ind === -1){
                        $scope.seccionesselecs.push(seccion);
                    }
                }else{
                    $scope.seccionesselecs.splice(ind, 1);
                }
            }else {
                $scope.$emit("on_seccion_sel", {seccion: seccion, otro: 'otro'});
                ModalServ.hide($scope.elementid);
            }
        };


        $scope.$on("show_modal_secciones", function(event, data){
            console.log("show_modal_secciones event----------------->");
            console.log(data)
            $('#'+$scope.elementid).off('show.bs.modal');
            $('#'+$scope.elementid).off('shown.bs.modal');
            $('#'+$scope.elementid).off('hide.bs.modal');
            $scope.session_sec_codigo = data['current']||0;
            $scope.selecvarios = data['selecvarios']||false;
            $scope.seccionesselecs = data['seccionesselecs']||[];
            $scope.onhide = data['onhide']||false;
            if($scope.onhide ){
                ModalServ.onHide($scope.elementid, function(e){
                    $scope.onhide();
                });
            }
            ModalServ.onShow($scope.elementid, function(e){
                $scope.load_secciones();
            });

            ModalServ.onShown($scope.elementid, function(e){
                $("#seccion_filter").focus();
            });
            ModalServ.show($scope.elementid);
        });


    }

})();