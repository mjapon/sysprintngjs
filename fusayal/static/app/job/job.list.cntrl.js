(function () {
    'use strict';
    angular.module("isyplus")
        .controller("JobCntrl", JobCntrl);

    function JobCntrl($scope, JobService, gridService, $state, ModalServ, NotifServ, swalService, ReportesServ, ListasServ) {

        var vm = $scope;

        vm.selectedItem = {};
        vm.selectedReport = 0;

        vm.crear = crear;
        vm.listar = listar;
        vm.cambiarEstado = cambiarEstado;
        vm.setPlantilla = setPlantilla;
        vm.aceptarModal = aceptarModal;
        vm.imprimir = imprimir;
        vm.selectPlantilla = selectPlantilla;
        vm.selectDocToPrint = selectDocToPrint;
        vm.showModalImprmir = showModalImprmir;
        vm.reportar = reportar;
        vm.reimprimir = reimprimir;
        vm.onRowClick = onRowClick;
        vm.testUpload = testUpload;


        vm.repgrid = {};
        vm.repgrid.selectedItem = {};

        init();

        function init() {
            gridService.initGrid(vm);
            vm.gridOptions.rowTemplate = rowTemplate();
            listar();
        }

        function crear() {
            $state.go('job_form', {job_id: 0});
        }

        var columnDefs = [
            {headerName: "Make", field: "make"},
            {headerName: "Model", field: "model"},
            {headerName: "Price", field: "price"}
        ];

        var rowData = [
            {make: "Toyota", model: "Celica", price: 35000},
            {make: "Ford", model: "Mondeo", price: 32000},
            {make: "Porsche", model: "Boxter", price: 72000}
        ];

        $scope.gridOptions2 = {
            columnDefs: columnDefs,
            rowData: rowData
        };

        function listar() {
            var res = JobService.get(function () {
                if (res.estado === 200) {
                    vm.gridOptions.columnDefs = res.cols;
                    vm.gridOptions.data = res.items;
                }
            });
        }

        function testUpload() {
            $state.go('job_upload');
        }

        function rowTemplate() {    //custom rowtemplate to enable double click and right click menu options
            return '<div ng-dblclick="grid.appScope.rowDblClick(row)"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>'
        }

        vm.rowDblClick = function (row) {
            vm.selectedItem = row.entity;
            showModalDetalles();
        }

        function showModalDetalles() {
            ModalServ.show('modalDetallesJob');
        }

        function hideModalDetalles() {
            ModalServ.hide('modalDetallesJob');
        }

        function auxCambiarEstado(newEstado, notif) {
            var params = {
                job_id: vm.selectedItem.job_id,
                newestado: newEstado
            };
            var res = JobService.cambiarEstado(params, function () {
                if (res.estado === 200) {
                    if (notif) {
                        NotifServ.success(res.msg);
                    }
                    listar();
                }
            });
        }

        function cambiarEstado(estado) {
            swalService.confirm('¿Esta seguro?', function (confirm) {
                if (confirm) {
                    var params = {
                        job_id: vm.selectedItem.job_id,
                        newestado: estado
                    };
                    var res = JobService.cambiarEstado(params, function () {
                        if (res.estado === 200) {
                            NotifServ.success(res.msg);
                            hideModalDetalles();
                            listar();
                        }
                    });
                }
            }, 'Cambiar estado del pedido');
        }

        function setPlantilla() {
            var res = ReportesServ.get(function () {
                if (res.status === 200) {
                    $scope.repgrid.columnDefs = res.cols;
                    $scope.repgrid.data = res.items;
                }
                ModalServ.show('modalSelPlant');
            });
        }

        function selectPlantilla(plantilla) {
            vm.repgrid.selectedItem = plantilla;
        }

        function selectDocToPrint(codReport, tipocopia) {
            console.log('doc to print');
            console.log(tipocopia);
            vm.selectedReport = codReport;
            imprimir(codReport);
            auxCambiarEstado(6);
        }

        function aceptarModal() {
            console.log(vm.repgrid.selectedItem);
            var res = JobService.putPlantilla({
                job_id: vm.selectedItem.job_id,
                temp_id: vm.repgrid.selectedItem.temp_id
            }, function () {
                if (res.estado == 200) {
                    NotifServ.success(res.msg);
                    ModalServ.hide('modalSelPlant');
                }
            });
        }

        function reportar() {
            cambiarEstado(2);
        }

        function reimprimir() {
            alert('reimprimir');
        }

        function onRowClick(row, rowIndex) {
            ListasServ.limpiaMarca(vm.gridOptions.data);
            if (row.marcado) {
                row.marcado = false;
            } else {
                row.marcado = true;
            }

            var selectedItem = ListasServ.getFirstMarcado(vm.gridOptions.data);
            if (selectedItem != null) {
                vm.selectedItem = selectedItem;
            } else {
                vm.selectedItem = null;
            }
        }

        function showModalImprmir() {
            ModalServ.show('modalSelTipoPrint');
        }

        function imprimir(tipocopia) {
            var temp_id = vm.repgrid.selectedItem.temp_id;
            var desde = vm.selectedItem.aut_secuencia_ini;
            var hasta = vm.selectedItem.aut_secuencia_fin;
            var jobid = vm.selectedItem.job_id;
            var url = "http://localhost:8080/imprentas_war/ReporteServlet?desde=" + desde + "&hasta=" + hasta + "&codrep=" + temp_id + "&tipocopia=" + tipocopia + "&jobid=" + jobid;
            console.log('url-->');
            console.log(url);
            window.open(url, "mywindow", "status=1,toolbar=1");
        }


    }
})();