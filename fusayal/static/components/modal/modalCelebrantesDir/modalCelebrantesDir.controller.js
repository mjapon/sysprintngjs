/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalCelebrantesDirCntrl", ModalCelebrantesDirCntrl);

    function ModalCelebrantesDirCntrl($scope, ModalServ, ModalCelebrantesService,AlertSrv, $timeout){
        $scope.celebrantes = [];
        $scope.celebrantesselecs = [];
        $scope.filtro_celebrante = {};
        $scope.current_celb_codigo = 0;
        $scope.celb_nvo = {};
        $scope.celb_edit = {};
        $scope.estilorow = "celebrante.celb_estado===1?{'background-color': '#CCCCCC'}:'' ";

        $scope.inicializavars= function(){
            ModalCelebrantesService.getCelebrante(0,$scope)
        }

        $scope.load_celebrantes = function(){
            ModalCelebrantesService.load_celebrantes($scope);
        };
        $scope.sel_celebrante = function(celebrante) {
            if(celebrante.celb_estado === 0){
                if($scope.selecvarios ){
                    var ind = -1;
                    celebrante.sel=!celebrante.sel;
                    //verifica el indice del poryecto seleccioando
                    for(var i in $scope.celebrantesselecs) {
                        if($scope.celebrantesselecs[i].celb_codigo === celebrante.celb_codigo){
                            ind = i;
                            break;
                        }
                    };
                    //agrega o elimina segun variable sel
                    if (celebrante.sel ){
                        if(ind === -1){
                            $scope.celebrantesselecs.push(celebrante);
                        }
                    }else{
                        $scope.celebrantesselecs.splice(ind, 1);
                    }
                }else {

                    $scope.$emit("on_celebrante_sel", {celebrante: celebrante, otro: 'otro'});
                    ModalServ.hide($scope.elementid);
                }
            }else{
                AlertSrv.info('Celebrante deshabilitado', 'INFORMACIÓN');
            }
        };

        $scope.$on("show_modal_celebrante", function(event, data){
            console.log("show_modal_celebrante event----------------->");
            console.log(data)
            $('#'+$scope.elementid).off('show.bs.modal');
            $('#'+$scope.elementid).off('shown.bs.modal');
            $('#'+$scope.elementid).off('hide.bs.modal');
            $scope.current_celb_codigo = data['current']||0;
            $scope.selecvarios = data['selecvarios']||false;
            $scope.celebrantesselecs = data['celebrantesselecs']||[];
            $scope.celb_estado = data['celb_estado'];
            $scope.onhide = data['onhide']||false;
            if($scope.onhide ){
                ModalServ.onHide($scope.elementid, function(e){
                    $scope.onhide();
                });
            }
            ModalServ.onShow($scope.elementid, function(e){
                $scope.load_celebrantes();
                $scope.inicializavars();
            });

            ModalServ.onShown($scope.elementid, function(e){
                $("#celebrante_filter").focus();
            });
            ModalServ.show($scope.elementid);
        });

        $scope.cambiaEstado = function(){
            $scope.celb_estado = $scope.celb_estado === 0? 1:0;
            ModalCelebrantesService.load_celebrantes($scope)
        };

        $scope.guardarCelebrante = function(celebrante,formulario){
            if(formulario.$valid){
                ModalCelebrantesService.guardarCelebrante(celebrante.celb_codigo,celebrante).then(function(rpta){
                    if (rpta.data.estado !== 0) {
                        //AlertSrv.success(rpta.data.msg, 'ÉXITO');
                        $scope.inicializavars();
                        ModalCelebrantesService.load_celebrantes($scope);
                    }
                })
            }else{
                console.log("debe ingresar un nombre")
            }
        };

        $scope.cancelar = function(){
            $scope.inicializavars();
            //ModalCelebrantesService.load_celebrantes($scope);
        };

        $scope.limpiar = function(){
            $scope.inicializavars();
        };

        $scope.cambiarestadoCelebrante = function(item, estado){
            var estadonvo =  estado==0?'HABILITAR':'DESHABILITAR';
            AlertSrv.confirm('USTED VA A '+estadonvo+' EL CELEBRANTE: '+item.celb_nombre+" , ¿DESEA PROSEGUIR?", function(isConfirm) {
                if (isConfirm) {
                    ModalCelebrantesService.cambiarestadoCelebrante(item.celb_codigo, estado).then(function(rpta){
                        if (rpta.data.estado !== 0) {
                            ModalCelebrantesService.load_celebrantes($scope);
                        }
                    });
                }
            })
        };

        $scope.asignar_celb_edit = function(celebrante ){
            $scope.celb_edit = angular.copy(celebrante);
            $timeout(function () {
                $('#nomcelebrante').focus();
            });
        };
    }
})();