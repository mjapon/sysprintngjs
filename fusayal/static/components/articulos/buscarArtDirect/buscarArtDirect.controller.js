/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.controller("BusArtDirectCntrl", BusArtDirectCntrl);

    function BusArtDirectCntrl($scope, $timeout, BaseAutocompServ, GeneralSrv, ListasServ, tseccionRest, tclaveRest) {

        var defPlaceHolder = "Digite el nombre del articulo";

        $scope.tipoArtSel = {};//El tipo de articulo seleccionado

        $scope.placeh = $scope.placeh || defPlaceHolder;

        $scope.secciones = [];//listado de secciones
        $scope.seccionSel = {};//Seccion seleccionada
        $scope.uri = "";//uri para consultas ajax

        /**
         * Establece el modo de busqueda ya sea por id (byid) o por nombre(bynom)
         * @param modo
         */
        $scope.setModuBus = function (modo) {
            $scope.uriparams.modo = modo;
            GeneralSrv.setFocusWithTimeout($scope.idprop, 100);
            $scope.placeh = modo === "byid" ? "Digite el código del artículo" : defPlaceHolder;
            reloadUri();
            saveUriParams();
        };

        $scope.changeSecCodigo = function (seccion) {
            $scope.seccionSel = seccion;
            $scope.uriparams.sec_codigo = seccion.sec_codigo;
            //$scope.uriparams.sec_desci = seccion.sec_desci;
            GeneralSrv.setFocusWithTimeout($scope.idprop, 100);
            reloadUri();
            saveUriParams();
        };


        $scope.changeTarCodigo = function (item) {
            $scope.uriparams.tar_codigo = item.tar_codigo;
            $scope.uriparams.tipo = item.tipo;
            GeneralSrv.setFocusWithTimeout($scope.idprop, 100);
            reloadUri();
            saveUriParams();
        };


        $scope.clearArtSel = function () {
            $scope.model = {};

            try {//Evaluar funcion listener
                $timeout(function () {
                    $scope.fnOnNull($scope.filtro);
                });
                GeneralSrv.setFocusWithTimeout($scope.idprop, 100);
            }
            catch (e) {
                console.error(" Error al ejecutar función ")
            }

        };

        $scope.onkeydown = function (event) {
            BaseAutocompServ.onkeydown($scope, event);
        };

        $scope.onkeyup = function (event) {
            BaseAutocompServ.onkeyup($scope, event);
        };

        $scope.sel_item = function (item) {
            BaseAutocompServ.sel_item($scope, item);
        };

        $scope.on_lost_focus = function (item) {
            BaseAutocompServ.on_lost_focus($scope);
        };

        $scope.$watch("model",
            function (newValue, oldValue) {
                BaseAutocompServ.on_model_change($scope);
            }
        );

        $scope.$watch("baseuri",
            function (newValue, oldValue) {
                BaseAutocompServ.on_uri_change($scope);
                reloadUri();
            }
        );

        $scope.$watch("uriparams.tar_codigo",
            function (newValue, oldValue) {
                console.log("watch property uriparams.tar_codigo--->", newValue);
                if (newValue) {
                    findTArtTipo();
                }
            }
        );

        $scope.$watch("uriparams.is_sec_codigo",
            function (newValue, oldValue) {
                console.log("watch property uriparams.is_sec_codigo--->", newValue);
                if (newValue) {
                    loadSecciones();
                }
            }
        );

        $scope.$watch("uriparams.tra_codigo",
            function (newValue, oldValue) {
                console.log("watch property uriparams.tra_codigo--->", newValue);
                if (newValue) {
                    loadDatosSesion();
                }
            }
        );

        $scope.$watch("uriparams.sec_codopu",
            function (newValue, oldValue) {
                if (newValue){
                    console.log("Cambia valor para uriparams.sec_codopu, nuevo valor es:", newValue);
                    reloadUri();
                }
            }
        );


        function reloadUri() {
            try {
                $scope.uri = $scope.baseuri + "&" + $.param($scope.uriparams);
                console.log("Valor para uri es");
                console.log($scope.uri);
            }
            catch (ex) {
                console.error("Error al tratar de setear uri", ex);
            }
        }


        /**
         * Si se requiere seleccion de secciones entonces se carga las secciones de la base
         */
        function loadSecciones() {
            $scope.secciones = [];
            if ($scope.uriparams && $scope.uriparams.is_sec_codigo === 1) {
                var res = tseccionRest.getAll(function () {
                    if (res.estado === 1) {
                        $scope.secciones = res.seccionesls;
                        findSeccion();
                    }
                });
            }
        }

        function findTArtTipo() {
            $scope.tipoArtSel = ListasServ.buscarObjeto($scope.tiposartlist,
                "tar_codigo",
                $scope.uriparams.tar_codigo);
        }

        function findSeccion() {
            $scope.seccionSel = ListasServ.buscarObjeto($scope.secciones,
                "sec_codigo",
                $scope.uriparams.sec_codigo);
            /*
            if ($scope.seccionSel) {
                $scope.uriparams.sec_desci = $scope.seccionSel.sec_desci;
            }
            */
        }

        function init() {
            loadSecciones();
            reloadUri();
            BaseAutocompServ.config($scope);
        }

        function loadDatosSesion(){
            var tra_codigo = $scope.uriparams['tra_codigo'];
            if (tra_codigo){
                var res = tclaveRest.getClaSesionTransac({tra_codigo:tra_codigo}, function(){
                    if (res.estado===200){
                        var cla_sesion_transac = res.cla_sesion_transac;
                        for (var prop in cla_sesion_transac){
                            $scope.uriparams[prop]=cla_sesion_transac[prop];
                        }
                        reloadUri();
                    }
                });
            }
        }

        function saveUriParams(){
            var tra_codigo = $scope.uriparams['tra_codigo'];
            if (tra_codigo){
                var res = tclaveRest.saveClaSesionTransac({tra_codigo:tra_codigo, setup:$scope.uriparams}, function(){
                  console.log("Resultado de actualizar en sesion trasac", res);
                })
            }
        }

        init();
    }
})(IsyplusApp);