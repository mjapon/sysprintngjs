/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("BuscarRefDirecCntrl", BuscarRefDirecCntrl);

    function BuscarRefDirecCntrl($scope, ReferenteSrv, GeneralSrv,AlertSrv, $timeout){
        $scope.valido = true;
        $scope.quitar_marca_rojo = function(){
            //$("#"+$scope.elementid).css("background-color","white");
            //$("#"+$scope.elementid).parent().removeClass("has-error");
        };

        $scope.poner_marca_rojo = function(){
            //$("#"+$scope.elementid).parent().addClass("has-error");
            //$("#"+$scope.elementid).css("background-color","#F08686");
        }

        $scope.validar_tipo_doc = function(){
            var length = ($scope.referente['clp_cedruc'] || "").length;
            if ( length >0  ){
                if ( length!==13 ){
                    if ($scope.trarefdoc===2){//Solo se permite ingresar ruc
                        AlertSrv.warning( "Ingrese un número de ruc válido", 'ADVERTENCIA');
                        return false;
                    }
                }
                else if (length!==10){
                    if ($scope.trarefdoc === 1){//Solo permite ingresar cedula
                        AlertSrv.warning( "Ingrese un numero de cédula válido", 'ADVERTENCIA');
                        return false;
                    }
                }
            }
            return true;
        }

        $scope.validar_nuevo = function(){
            var length = ($scope.referente['clp_cedruc'] || "").length;
            if ( length >0  ){
                if ( length===10 ){//Debo validar cedula
                    //Validar tipo de documento que puede ingresar
                    $scope.valido = GeneralSrv.esCedulaValida($scope.referente['clp_cedruc']);
                    $scope.referente['clp_tipoid'] = '05';
                }
                else if (length===13){
                    $scope.valido = GeneralSrv.esRucValido($scope.referente['clp_cedruc']);
                    $scope.referente['clp_tipoid'] = '04';
                }
                else{
                    $scope.valido = false;
                    $scope.referente['clp_tipoid'] = '';
                }
            }
        }

        $scope.validar_existente = function(){
            var length = ($scope.referente['clp_cedruc'] || "").length;
            if ( length >0  ){
                if ( $scope.referente['clp_tipoid'] === '05' ){
                    $scope.valido = GeneralSrv.esCedulaValida($scope.referente['clp_cedruc']);
                }
                else if ( $scope.referente['clp_tipoid'] === '04' ){
                    $scope.valido = GeneralSrv.esRucValido($scope.referente['clp_cedruc']);
                }
                else if ( $scope.referente['clp_tipoid']=='' ) {
                    $scope.valido = false;
                }
                else{
                    $scope.valido = true;
                }
            }
        }

        $scope.buscar_ref = function(){
            var aux_clp_cedruc = $scope.referente.clp_cedruc;
            if (!(aux_clp_cedruc && aux_clp_cedruc.length>0)){
                    AlertSrv.warning( 'Ingrese el número de CI/RUC del referente', 'ADVERTENCIA');
                GeneralSrv.setFocus($scope.elementid);
                return;
            }

            var continuar = $scope.validar_tipo_doc();
            if (!continuar){
                $scope.clear_referente();
                return;
            }

            ReferenteSrv.getReferenteByCedNoComps(aux_clp_cedruc).then(function(response){
                if(response.data['estado']>=1){
                    GeneralSrv.copyValues(response.data['ref'], $scope.referente);
                }
                if (response.data['estado']==1){
                    $scope.validar_existente();
                    $scope.onreffind();
                }
                else if (response.data['estado']==2){
                    toastr.warning("Referente no registrado");
                    $scope.referente.clp_cedruc = aux_clp_cedruc;
                    $scope.validar_nuevo();
                    $scope.onrefnull();
                }
            })
        }

        $scope.$watch("valido", function(newValue, oldValue){
            if (newValue===true){
                $scope.quitar_marca_rojo();
            }
            else if (newValue===false){
                $scope.poner_marca_rojo();
            }
        });

        $scope.clear_referente = function(){
            //$scope.referente['clp_tipoid']  = '';
            $scope.referente['clp_cedruc']  = '';
            $scope.referente['clp_codigo']  = 0;
            $scope.referente['clp_nombre']  = '';
            $scope.referente['clp_apelli']  = '';
            $scope.referente['clp_direcc']  = '';
            $scope.referente['clp_telefo']  = '';
            $scope.referente['clp_email']  = '';
        }

        $scope.$watch("referente", function(newValue, oldValue){
            //console.log("watch referente--->newvalue val is:");
            //console.log(newValue);
            var newclp_cedruclent = 0;
            if (newValue){
                newclp_cedruclent = (newValue['clp_cedruc']||'').length;
            }
            if (newclp_cedruclent>0){
                //console.log("verificar tipo de identificacion en funcion de trarefdoc --->");
                $timeout(function(){
                    if ( !$scope.validar_tipo_doc() ){
                        $scope.clear_referente();
                    }
                },100);
            }
        })
    }
})();