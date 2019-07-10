(function () {
    'use strict';
    angular.module("isyplus")
        .controller("AutorizacionCntrl", AutorizacionCntrl);

    function AutorizacionCntrl($scope, $state, AutorizacionServ, gridService, ModalServ, ListasServ) {
        var vm = $scope;
        vm.selectedItem = {};

        vm.setupgrid = {pag: true};
        vm.setupgrid.checks = {hideColumncheck: true};

        vm.crear = crear;
        vm.listar = listar;
        vm.onRowClick = onRowClick;

        init();

        function init() {
            gridService.initGrid(vm);
            vm.gridOptions.rowTemplate = rowTemplate();
            listar();
        }

        function crear() {
            $state.go("auts_form");
        }

        function listar() {
            var res = AutorizacionServ.get(function () {
                if (res.estado === 200) {
                    vm.gridOptions.columnDefs = res.cols;
                    vm.gridOptions.data = res.items;
                }
            });
        }


        function rowTemplate() {    //custom rowtemplate to enable double click and right click menu options
            return '<div ng-dblclick="grid.appScope.rowDblClick(row)"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell"  ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>'
        }

        vm.rowDblClick = function (row) {
            vm.selectedItem = row.entity;
            showModalDetalles();
        };

        function showModalDetalles() {
            ModalServ.show('modalDetallesAuts');
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

    }
})();