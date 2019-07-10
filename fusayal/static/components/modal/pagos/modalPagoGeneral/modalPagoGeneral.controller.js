/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalPagoGeneralCntrl", ModalPagoGeneralCntrl);

    function ModalPagoGeneralCntrl($scope){
        $scope.ctas_contables = [];
        $scope.cta_contable_sel = {};

        $scope.on_cta_contable_change = function(){
            $scope.form['cta_codigo'] = $scope.cta_contable_sel['cta_codigo'];
            $scope.form['ttp_signo'] = $scope.cta_contable_sel['ttp_signo'];
        }

        $scope.find_cta_contable = function(cta_codigo_def){
            $scope.form['cta_codigo'] = cta_codigo_def;
            $scope.cta_contable_sel = {};
            $.each($scope.ctas_contables, function(index, value){
                if ($scope.form['cta_codigo'] === value['cta_codigo']){
                    $scope.cta_contable_sel = value;
                }
            });
        }

        $scope.$on('add_pagogen_event', function(event, data) {
            $scope.ttransaccpago = data['forma_pago_sel'];
            var cta_codigo_def =  data['cta_codigo_def'];
            $scope.ctas_contables = $scope.ttransaccpago['subitems'];
            $scope.find_cta_contable(cta_codigo_def);
        });
    }

})();