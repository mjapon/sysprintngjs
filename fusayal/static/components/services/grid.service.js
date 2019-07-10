/**
 * Created by serviestudios on 13/04/16.
 */
(function (module) {
    'use strict';

    module.factory("gridService", gridService);

    function gridService(ListasServ) {

        return {
            getFilasMarcadas: getFilasMarcadas,
            onRowClicSingle: onRowClicSingle,
            onRowClicMultiple: onRowClicMultiple,
            onCheckClicSingle: onCheckClicSingle,
            onCheckClicMultiple: onCheckClicMultiple,
            initGrid: initGrid
        };

        function getFilasMarcadas(theArray, filtro) {
            var filtro = filtro || {marcado: true};
            return ListasServ.filtrar(theArray, filtro);
        }

        /**
         * En este caso solo es permitido seleccion de una sola fila, debe haber solo una fila con valor marcado = true
         * @param theArray
         * @param row
         */
        function onRowClicSingle(theArray, row) {
            var currentMarca = row.marcado || false;
            ListasServ.limpiarMarcados(theArray, {marcado: true}, 'marcado');

            row.marcado = !currentMarca;
        }

        function onRowClicMultiple(theArray, row) {
            var currentMarca = row.marcado || false;
            row.marcado = !currentMarca;
        }

        function onCheckClicSingle(theArray, row) {
            var currentMarca = row.marcado || false;
            ListasServ.limpiarMarcados(theArray, {marcado: true}, 'marcado');
            row.marcado = currentMarca;
        }

        function onCheckClicMultiple(theArray, row) {
            var currentMarca = row.marcado || false;
            row.marcado = currentMarca;
        }

        function initGrid(vm) {
            vm.gridOptions = {
                enableRowSelection: true,
                enableFullRowSelection: true,
                enableSelectAll: false,
                selectionRowHeaderWidth: 40,
                rowHeight: 45,
                showGridFooter: true
            };

            vm.gridOptions.columnDefs = [];
            vm.gridOptions.multiSelect = false;

            vm.gridOptions.onRegisterApi = function (gridApi) {
                vm.gridApi = gridApi;

                gridApi.selection.on.rowSelectionChanged(vm, function (row) {
                    if (row.isSelected) {
                        vm.selectedItem = row.entity;
                    } else {
                        vm.selectedItem = {};
                    }
                });
                gridApi.selection.on.rowSelectionChangedBatch(vm, function (rows) {
                    //var msg = 'rows changed ' + rows.length;console.log(msg);
                });
            };
        }
    }

})(IsyplusApp);