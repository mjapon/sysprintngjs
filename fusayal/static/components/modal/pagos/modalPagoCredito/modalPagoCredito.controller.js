/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalPagoCreditoCntrl", ModalPagoCreditoCntrl);

    function ModalPagoCreditoCntrl($scope, TBancoServ, CreditosTransaccServ, ListasServ, NumberServ, ReferenteSrv, GeneralSrv) {
        $scope.bancos = [];
        $scope.banco_sel = {};
        $scope.cta_contable_sel = {};
        $scope.ctas_contables = [];
        $scope.show_crea_cred = 1;
        $scope.clp_codigo = 0;
        $scope.creditos = [];
        $scope.cols_creditos = [];
        //$scope.trn_codigo_fact = 0;//Se usa en retenciones si trn_codig_fact es >0 entonces se trata de una retencion
        $scope.modal_size = '';
        $scope.pago_cred_ref_disabled = false;

        var montoTotalFactura = "";//Se debe pasara desde la pantalla que use este modal el total de la factura para validacion

        $scope.$watch("cta_contable_sel", function(newValue, oldValue){
            $scope.modal_size = " ";
            if ($scope.ttransaccpago){
                var ttp_signo = $scope.form['ttp_signo'];
                var tct_codigo = $scope.ttransaccpago['tct_codigo'];
                $scope.show_crea_cred = 1;

                if ( (tct_codigo===2) && (ttp_signo===1)){//se debe hacer un registro en tasiabono-->
                    $scope.show_crea_cred = 0;
                }
                else if( (tct_codigo===1) && (ttp_signo===-1)){//se debe hacer un registro en tasiabono-->
                    $scope.show_crea_cred = 0;
                }

                if ($scope.show_crea_cred===0){
                    //Listar los creditos del referente y la cuenta seleccionada
                    $scope.load_creditos();
                    $scope.modal_size = "modal-lg";
                }
                else{
                    $scope.creditos = [];
                    $scope.cols_creditos = [];
                }
            }
        });

        $scope.onMarcaCreditoChange = function(item, val_marcado){
            ListasServ.limpiarMarcados($scope.creditos, {marcado:true}, 'marcado');//Limpia todos los marcados
            item.marcado = val_marcado;
            if (item.marcado){
                $scope.form.dt_codcre = item.dt_codigo;
                var saldo = NumberServ.redondear(item['saldo'],2);
                //var monto_total =  NumberServ.redondear($scope.$parent.form_totales['total'], 2);
                //if (saldo > monto_total){
                if (saldo > montoTotalFactura){
                    $scope.form.dt_valor = montoTotalFactura;
                }
                else{//monto total es mayor o igual al saldo
                    $scope.form.dt_valor = saldo;
                }
            }
        };

        $scope.onFilaCredClick = function(item){
            var val_marcado = item['marcado']||false;
            $scope.onMarcaCreditoChange(item, !val_marcado);
        };

        $scope.onChekClick = function(item){
            var val_marcado = item['marcado']||false;
            $scope.onMarcaCreditoChange(item, val_marcado);
        };

        $scope.load_creditos = function(){
            if ($scope.cta_contable_sel['cta_codigo']){
                var params = {
                    cta_codigo:$scope.cta_contable_sel['cta_codigo'],
                    clp_codigo:$scope.clp_codigo,
                    clc_id:$scope.ttransaccpago['clc_id']
                };
                CreditosTransaccServ.listar_creditos(params,function(response){
                    if(response.data['items']){
                        $scope.creditos = response.data['items'];
                        $scope.cols_creditos = response.data['cols'];
                    }
                });
            }
            else{
                $scope.creditos = [];
                $scope.cols_creditos = [];
            }
        };

        $scope.find_cta_contable = function(cta_codigo_def){
            /*
            console.log("find_cta_contable --->");
            console.log("cta_codigodef:", cta_codigo_def);
            console.log("$scope.ctas_contables:", $scope.ctas_contables);
            */

            $scope.form['cta_codigo'] = cta_codigo_def;
            $scope.cta_contable_sel = {};
            $.each($scope.ctas_contables, function(index, value){
                console.log($scope.form['cta_codigo'], value['cta_codigo'], $scope.form['cta_codigo'] === value['cta_codigo']);
                if ($scope.form['cta_codigo'] === value['cta_codigo']){
                    $scope.cta_contable_sel = value;
                }
            });

            if ($scope.show_crea_cred===0){
                $scope.modal_size = "modal-lg";
            }
            else{
                $scope.modal_size = " ";
            }
        };

        $scope.on_cta_contable_change = function(){
            //console.log("cta contable change------------>");
            $scope.form['cta_codigo'] = $scope.cta_contable_sel['cta_codigo'];
            $scope.form['ttp_signo'] = $scope.cta_contable_sel['ttp_signo'];
        };

        $scope.find_banco = function(){
            $.each($scope.bancos, function(index, value){
                if ($scope.form['tasicredito']['cre_codban']===value['ban_codigo']){
                    $scope.banco_sel = value;
                }
            });
        };

        $scope.on_banco_change = function(){
            $scope.find_banco();
            $scope.form['tasicredito']['ban_nombre'] = $scope.banco_sel['ban_nombre'] || '';
        };

        $scope.load_bancos = function(){
            TBancoServ.listar_por_tipo(2, function(response){
                if (response.data['items']){
                    $scope.bancos = response.data['items'];
                }
            });
        };

        $scope.load_info_ref = function() {
            console.log("Valor para clp_codigo es:");
            console.log($scope.form['clp_codigo']);
            var clp_codigo = $scope.form['clp_codigo']||0;
            if (clp_codigo != 0){
                ReferenteSrv.getReferenteNoComps(clp_codigo).then(function(res){
                    console.log('Info del referente es:');
                    if(res.data['estado']==1){
                        GeneralSrv.copyValues(res.data['ref'], $scope.form);
                    }
                });
            }
        };

        $scope.validarPago = function(){
            var cerraModal = true;
            if ($scope.show_crea_cred===0){
                if (!$scope.form.dt_codcre || $scope.form.dt_codcre===0){
                    toastr.error("Debe seleccionar el crédito");
                    cerraModal = false;
                }
            }

            if (cerraModal){
                $scope.fnguardar();
            }
        };

        $scope.$on('add_tasicredito_event', function(event, data) {
            $scope.ttransaccpago = data['forma_pago_sel'];
            var cta_codigo_def =  data['cta_codigo_def'];
            $scope.clp_codigo = data['clp_codigo'];
            $scope.ctas_contables = $scope.ttransaccpago['subitems'];
            $scope.load_bancos();
            $scope.find_cta_contable(cta_codigo_def);
            montoTotalFactura = data['totalFactura']||0.0;
        });
    }
})();