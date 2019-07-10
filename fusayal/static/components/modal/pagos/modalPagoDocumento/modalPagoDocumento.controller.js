/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalPagoDocumentoCntrl", ModalPagoDocumentoCntrl);

    function ModalPagoDocumentoCntrl($scope, TTipdocServ, TBancoServ, ReferenteSrv, GeneralSrv){
        $scope.tiposdoc = [];
        $scope.bancos = [];
        $scope.tipo_doc_sel = {};
        $scope.banco_sel = {};

        $scope.find_tipo_doc = function(){
            $.each($scope.tiposdoc, function(index, value){
                if ($scope.form['tasidocum']['td_codigo']===value['td_codigo']){
                    $scope.tipo_doc_sel = value;
                }
            });
        }

        $scope.find_banco = function(){
            $.each($scope.bancos, function(index, value){
                if ($scope.form['tasidocum']['doc_codban']===value['ban_codigo']){
                    $scope.banco_sel = value;
                }
            });
        }

        $scope.$watchCollection("tiposdoc", function(newValue, oldValue){
            if (newValue && newValue.length>0){
                if ($scope.form['editando']===true){
                    $scope.find_tipo_doc();
                    $scope.on_tipo_doc_change();
                }
            }
        })

        $scope.$watchCollection("bancos", function(newValue, oldValue){
            if (newValue && newValue.length>0){
                if ($scope.form['editando']===true){
                    $scope.find_banco();
                }
            }
        })

        $scope.load_tipos_doc = function(){
            if ( $scope.ttransaccpago['ttp_coddocs'].length>0 ){
                TTipdocServ.listar_por_coddocs($scope.ttransaccpago['ttp_coddocs'], function(response){
                    if (response.data['items']){
                        $scope.tiposdoc = response.data['items'];
                    }
                });
            }else{
                console.log("no encontro ttp_coddocs es")
                console.log($scope.ttransaccpago)
                $scope.tiposdoc=[];
                $scope.bancos = [];
            }
        };
        $scope.on_tipo_doc_change = function(){
            var params = { tra_codigo:$scope.ttransacc['tra_codigo'],
                tra_tippag:$scope.ttransacc['tra_tippag'],
                td_emited:$scope.tipo_doc_sel != undefined?$scope.tipo_doc_sel['td_emited']:null ,
                clc_infadi:$scope.ttransaccpago['clc_infadi'],
                clc_codigo:$scope.ttransaccpago['clc_codigo']
            };
            $scope.form['tasidocum']['td_codigo'] = $scope.tipo_doc_sel != undefined? $scope.tipo_doc_sel['td_codigo']:null;
            $scope.form['tasidocum']['td_descri'] = $scope.tipo_doc_sel != undefined? $scope.tipo_doc_sel['td_descri']:null;

            if ($scope.ttransaccpago['clc_id'] == 'BA'){
                $scope.form['tasidocum']['doc_emited'] = 1;
            }
            else{
                $scope.form['tasidocum']['doc_emited'] = 0;
            }
            if ( $scope.ttransaccpago['ttp_coddocs'].length>0 && params.td_emited!=null ) {
                TBancoServ.listar_para_formas_pago(params, function (response) {
                    $scope.bancos = response.data['items'] || [];
                    $scope.tipo_bancos = response.data['tipo'] || 'bancos';
                    console.log("valor para tipo_bancos es: ");
                    console.log($scope.tipo_bancos);
                });
            }else{
                $scope.bancos = [];
                $scope.tipo_bancos = 'bancos';

            }
        }

        $scope.on_banco_change = function(){
            if ($scope.banco_sel!= undefined) {
                if ($scope.banco_sel['cta_codigo']) {
                    $scope.form['cta_codigo'] =  $scope.banco_sel['cta_codigo'];
                    $scope.form['ttp_signo'] = $scope.banco_sel['ttp_signo'];
                }
                $scope.form['tasidocum']['doc_codban'] = $scope.banco_sel['ban_codigo'];
                $scope.form['tasidocum']['ban_nombre'] = $scope.banco_sel['ban_nombre'];
            }
        }

        $scope.buscar_ref = function(){
            var aux_clp_cedruc = $scope.form.tasidocum.clp_cedruc;
            if (!(aux_clp_cedruc && aux_clp_cedruc.length>0)){
                alert('Ingrese el número de ci/ruc del referente');
                return;
            }
            ReferenteSrv.getReferenteByCedNoComps(aux_clp_cedruc).then(function(response){
                if(response.data['estado']>=1){
                    GeneralSrv.copyValues(response.data['ref'], $scope.form.tasidocum);
                }
                if (response.data['estado']==2){
                    toastr.warning("Referente no registrado");
                    $scope.form.tasidocum.clp_cedruc = aux_clp_cedruc;
                }
            })
        }

        $scope.$on('add_tasidocum_event', function(event, data) {
            $scope.ttransaccpago = data['forma_pago_sel'];
            $scope.load_tipos_doc();
        });
    }
})();