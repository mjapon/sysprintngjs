(function () {
    'use strict';
    angular.module("isyplus")
        .controller("ReportesSysCntrl", ReportesSysCntrl);

    function ReportesSysCntrl($scope, ReportesServ, gridService, $state, GeneralSrv, FechasServ, NotifServ,
                              ContribuyenteServ, AuditService) {

        var vm = $scope;

        vm.listar = listar;
        vm.selReporte = selReporte;
        vm.selectedItem = {};
        vm.reportesList = [];
        vm.paramsRepSel = {};
        vm.form = {job_estado:2};
        vm.fechasDisabled = false;
        vm.contribsEnabled = false;
        vm.estadoJobEnabled = false;

        vm.estabEnabled = false;
        vm.ptoEmiEnabled = false;
        vm.tipodocEnabled = false;

        vm.formExport = {};
        vm.contribsel = {};
        vm.onContribSel = onContribSel;
        vm.contribsLoaded = false;

        vm.listas = {contributentes: [], estadosjob:[], tiposdoc :[]};


        var ipServer = GeneralSrv.getIPServer();


        vm.imprimir = imprimir;

        init();

        function init() {
            console.log("Reportes Sys Cntrl Init executed-->");
            listar();
        }

        function listar() {
            console.log('Se ejecuta accion listar');

            var res = ReportesServ.get({tipo: 2}, function () {
                if (res.status === 200) {
                    vm.reportesList = res.items;
                    console.log("reportes list es:");
                    console.log(vm.reportesList);
                    vm.formExport = res.formexport;
                    vm.listas.estadosjob = res.estadojob;
                    vm.listas.tiposdoc = res.tiposdoc;
                }
            });

            /*var res = ReportesServ.get(function () {
                console.log("Respuesta del servidor es");
                console.log(res);
                if (res.status == 200) {
                    vm.lista = res.lista;
                }
            });*/
        }

        function loadContribs() {
            var res = ContribuyenteServ.get(function () {
                if (res.estado === 200) {
                    vm.listas.contributentes = res.items;
                    vm.contribsLoaded = true;
                }
            });
        }

        function onContribSel(contribsel) {
            if (contribsel) {
                vm.contribsel = contribsel;
                vm.form.cnt_id = contribsel.cnt_id;
            }
        }


        function selReporte(rep) {
            vm.selectedItem = rep;

            vm.fechasDisabled = false;
            vm.contribsEnabled = false;
            vm.estadoJobEnabled = false;

            vm.estabEnabled = false;
            vm.ptoEmiEnabled = false;
            vm.tipodocEnabled = false;

            vm.paramsRepSel = JSON.parse(rep.temp_params);

            if (vm.paramsRepSel && vm.paramsRepSel['fec']) {

            }
            else {
                vm.fechasDisabled = true;
            }

            if (vm.paramsRepSel && vm.paramsRepSel['cnt']) {
                vm.contribsEnabled = true;
            }

            if (vm.paramsRepSel && vm.paramsRepSel['statusjob']) {
                vm.estadoJobEnabled = true;
            }

            if (vm.paramsRepSel && vm.paramsRepSel['stab']) {
                vm.estabEnabled = true;
            }

            if (vm.paramsRepSel && vm.paramsRepSel['ptoemi']) {
                vm.ptoEmiEnabled = true;
            }

            if (vm.paramsRepSel && vm.paramsRepSel['tipodoc']) {
                vm.tipodocEnabled = true;
            }

            if (vm.contribsEnabled) {
                if (!vm.contribsLoaded) {
                    loadContribs();
                }
            }

        }

        function fechasIngresadas() {
            var result = true;
            if (vm.form.desde === undefined || vm.form.desde.length === 0) {
                result = false;
                NotifServ.warning('Ingrese la fechas');
            }
            else if (vm.form.hasta === undefined || vm.form.hasta.length === 0) {
                result = false;
                NotifServ.warning('Ingrese la fechas');
            }
            return result;
        }

        function imprimir() {
            var codigorep = vm.selectedItem.temp_id;

            var prmObj = {
                codigorep:codigorep,
                pGeneradoPor:vm.formExport['pGeneradoPor'],
                pContribuyente:vm.formExport['pContribuyente'],
                pFechaDesde:FechasServ.get_fecha_db(vm.form.desde),
                pFechaHasta:FechasServ.get_fecha_db(vm.form.hasta),
                emp_esquema:globalEmpEsquema
            };

            /*
            var pGeneradoPor = vm.formExport['pGeneradoPor'];
            var pContribuyente = vm.formExport['pContribuyente'];
            var pFechaDesde = FechasServ.get_fecha_db(vm.form.desde);
            var pFechaHasta = FechasServ.get_fecha_db(vm.form.hasta);
            */

            console.log("Valor de form es");
            console.log(vm.form);

            var continuar = true;

            prmObj['pCntId'] = 0;
            if (vm.contribsEnabled) {
                if (!vm.contribsel.cnt_id){
                    continuar = false;
                    NotifServ.warning('Seleccione el contribuyente');
                }
                else{
                    prmObj['pCntId'] = vm.contribsel.cnt_id;
                    prmObj['pContribuyente'] = vm.contribsel.cnt_razonsocial;
                }
            }


            if (!vm.fechasDisabled && !fechasIngresadas()) {
                continuar = false;
            }

            if (vm.estadoJobEnabled){
                prmObj['pStatusJob'] = vm.form.job_estado;
            }

            if (continuar) {
                /*var allParams = "pGeneradoPor=" + pGeneradoPor +
                    ";pContribuyente=" + pContribuyente +
                    ";pFechaDesde=" + pFechaDesde +
                    ";pFechaHasta=" + pFechaHasta;
                    */
                var allParams = $.param(prmObj);
                var url = "http://" + ipServer + ":8080/imprentas/ReportePathServlet?" + allParams;
                console.log('url-->');
                console.log(url);
                window.open(url, "mywindow", "status=1,toolbar=1");


                var res = AuditService.save({
                    aud_id: 0,
                    temp_id: codigorep
                }, function () {
                    if (res.estado == 200) {
                        console.log("Se registro exitosamente el log");
                        console.log(res);
                    }
                });
            }
        }
    }
})();