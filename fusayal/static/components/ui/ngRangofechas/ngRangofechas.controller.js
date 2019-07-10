/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("NgRangoFechasCntrl", NgRangoFechasCntrl);

    function NgRangoFechasCntrl($scope){
        $scope.auxfnrango = function(rango){};
        $scope.auxfnenter = function(){};
        $scope.fnonchange = $scope.auxfnenter;
        $scope.fnondesdeenter = $scope.auxfnenter;
        $scope.fnondesdeblur= $scope.auxfnenter;
        $scope.fnonhastaenter = $scope.auxfnenter;
        $scope.fnonhastablur = $scope.auxfnenter;
        $scope.idpropdesde = 'desde';
        $scope.idprophasta = 'hasta';

        if ($scope.setup['fnonchange']){
            $scope.fnonchange= $scope.setup['fnonchange'];
        }
        if ($scope.setup['fnondesdeenter']){
            $scope.fnondesdeenter = $scope.setup['fnondesdeenter'];
        }
        if ($scope.setup['fnondesdeblur']){
            $scope.fnondesdeblur = $scope.setup['fnondesdeblur'];
        }
        if ($scope.setup['fnonhastaenter']){
            $scope.fnonhastaenter = $scope.setup['fnonhastaenter'];
        }
        if ($scope.setup['fnonhastablur']){
            $scope.fnonhastablur = $scope.setup['fnonhastablur'];
        }
        if ($scope.setup['idpropdesde']){
            $scope.idpropdesde = $scope.setup['idpropdesde'];
        }
        if ($scope.setup['idprophasta']){
            $scope.idprophasta = $scope.setup['idprophasta'];
        }

        $scope.formatMoment = function(DATE){
            return DATE.format('DD/MM/YYYY');
        }
        $scope.hoy = function(){
            var Date = moment();
            return {desde:$scope.formatMoment(Date),hasta:$scope.formatMoment(Date)};
        }
        $scope.ayer = function(){
            var Date = moment();
            var ayer = Date.add('days',-1);
            return {desde:$scope.formatMoment(ayer),hasta:$scope.formatMoment(ayer)};
        }
        $scope.semana = function(){
            var Date = moment();
            return{desde: $scope.formatMoment(Date.startOf('week').add('days',1)),
                hasta:$scope.formatMoment(Date.endOf('week').add('days',1))}
        }
        $scope.mes = function(){
            var Date = moment();
            return{desde: $scope.formatMoment(Date.startOf('month')),
                hasta:$scope.formatMoment(Date.endOf('month'))}
        }
        $scope.mesant = function(){
            var Date = moment();
            var mesant = Date.add('month',-1);
            return{desde: $scope.formatMoment(mesant.startOf('month')),
                hasta:$scope.formatMoment(mesant.endOf('month'))}
        }
        $scope.anio = function(){
            var Date = moment();
            return{desde: $scope.formatMoment(Date.startOf('year')),
                hasta:$scope.formatMoment(Date.endOf('year'))}
        }
        $scope.futuro = function(){
            var Date = moment();
            return{desde: $scope.formatMoment(Date),
                hasta:$scope.formatMoment(Date.add('year',1))}
        }
        $scope.sigsem = function(){
            var Date = moment();
            var sigsem = Date.add('week',1);
            return{desde: $scope.formatMoment(sigsem.startOf('week').add('days',1)),
                hasta:$scope.formatMoment(sigsem.endOf('week').add('days',1))}
        }

        $scope.getRangoFechas = function(tipo){
            if (tipo === 'hoy'){
                return $scope.hoy();
            }
            else if (tipo === 'ayer'){
                return $scope.ayer();
            }
            else if (tipo === 'semana'){
                return $scope.semana();
            }
            else if (tipo === 'mes'){
                return $scope.mes();
            }
            else if (tipo === 'mesant'){
                return $scope.mesant();
            }
            else if (tipo === 'anio'){
                return $scope.anio();
            }
            else if (tipo === 'futuro'){
                return $scope.futuro();
            }
            else if (tipo === 'sigsem'){
                return $scope.sigsem();
            }
        }

        $scope.cambiarFecha = function(fn){
            try{
                var rango = $scope.getRangoFechas(fn);
                $scope.form['desde'] = rango['desde'];
                $scope.form['hasta'] = rango['hasta'];
                $scope.fnonchange()
            }
            catch (e){
                console.error("Error al tratar de obtener valores de fechas");
                console.error(e);
            }
        }
    }
})();