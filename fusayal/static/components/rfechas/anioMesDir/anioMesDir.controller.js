/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("AnioMesDirCntrl", AnioMesDirCntrl);

    function AnioMesDirCntrl($scope, FechasServ, NumberServ){
        $scope.label_mes_desde = "";
        $scope.label_mes_hasta = "";
        $scope.idpropdesde = 'desde';
        $scope.idprophasta = 'hasta';
        $scope.anioa = "";
        $scope.aniob = "";
        $scope.mesa = "";
        $scope.mesb = "";

        $scope.auxfnenter = function(){};

        if ($scope.setup['fnondesdeenter']){
            $scope.fnondesdeenter = $scope.setup['fnondesdeenter'];
        }
        if ($scope.setup['fnonhastaenter']){
            $scope.fnonhastaenter = $scope.setup['fnonhastaenter'];
        }

        if ($scope.setup['idpropdesde']){
            $scope.idpropdesde = $scope.setup['idpropdesde'];
        }
        if ($scope.setup['idprophasta']){
            $scope.idprophasta = $scope.setup['idprophasta'];
        }

        $scope.get_label_mes = function(mes){
            var label_mes = FechasServ.getMesLargo(mes-1);
            return label_mes||'';
        }

        $scope.set_mes = function(tipo, mes){
            if (tipo == 1){
                $scope.form.mesa = mes;
                $scope.label_mes_desde = $scope.get_label_mes(mes);
            }
            else{
                $scope.form.mesb = mes;
                $scope.label_mes_hasta = $scope.get_label_mes(mes);
            }
            $scope.on_fechas_change();
        }

        $scope.on_fechas_change = function(){
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1, $scope.form.mesa, $scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1, $scope.form.mesb, $scope.form.aniob);
            }
            else{
                console.log("El valor del anio es incorrecto no se cambia valor de anio--->");
            }
        }

        $scope.on_anio_change = function(){
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1,1,$scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1,1,$scope.form.aniob);
            }
            else{
                console.log("El valor del anio es incorrecto no se cambia valor de anio--->");
            }
        }

        $scope.init = function() {
            $scope.anioa = $scope.form.anioa;
            $scope.aniob = $scope.form.aniob;
            $scope.mesa = $scope.form.mesa;
            $scope.mesb = $scope.form.mesb;
            $scope.label_mes_desde = $scope.get_label_mes($scope.form.mesa);
            $scope.label_mes_hasta = $scope.get_label_mes($scope.form.mesb);
        }

        $scope.init_rango_anio = function(){
            $scope.init();
            if ( (NumberServ.isNumber($scope.form.anioa)) && (NumberServ.isNumber($scope.form.aniob)) ){
                $scope.form.desde = FechasServ.change_day_month_year($scope.form.desde, 1,1,$scope.form.anioa);
                $scope.form.hasta = FechasServ.change_day_month_year($scope.form.hasta, 1,1,$scope.form.aniob);
            }
        }

        $scope.$on('init_rango_fechas', function(event, data) {
            //console.log("escuchando init event---->");
            $scope.init();
        })

        $scope.$on('init_rango_fechas_anio', function(event, data) {
            //console.log("escuchando init rango fechas event---->");
            $scope.init_rango_anio();
        })

        $scope.$watch("anioa", function(newValue, oldValue) {
            try{
                $scope.form.anioa = newValue;
                $scope.on_anio_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("aniob", function(newValue, oldValue) {
            try{
                $scope.form.aniob = newValue;
                $scope.on_anio_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("mesa", function(newValue, oldValue) {
            try{
                $scope.form.mesa = newValue;
                $scope.on_fechas_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
        $scope.$watch("mesb", function(newValue, oldValue) {
            try{
                $scope.form.mesb = newValue;
                $scope.on_fechas_change();
            }
            catch(e){
                console.log("Error en onfechaschange");
            }
        });
    }
})();