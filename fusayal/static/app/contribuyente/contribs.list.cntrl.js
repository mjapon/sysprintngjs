(function () {
    'use strict';
    angular.module("isyplus")
        .controller("ContribCntrl", ContribCntrl);

    function ContribCntrl($scope, $state, ContribuyenteServ, gridService, ModalServ, ListasServ) {

        var vm = $scope;
        vm.selectedItem = {};

        gridService.initGrid(vm);

        vm.crear = crear;
        vm.listar = listar;
        vm.editar = editar;
        vm.showModalDetalles = showModalDetalles;

        vm.setupgrid = {pag:true};
        vm.setupgrid.checks = {hideColumncheck: true };
        vm.onRowClick = onRowClick;
        //vm.onFilaCredClick = onFilaCredClick;

        // vm.setupgrid.checks.hideColumncheck = true;

        init();

        function init() {
            vm.gridOptions.rowTemplate = rowTemplate();
            listar();
        }

        function rowTemplate() {    //custom rowtemplate to enable double click and right click menu options
            return '<div ng-dblclick="grid.appScope.rowDblClick(row)"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>'
        }

        vm.rowDblClick = function (row) {
            vm.selectedItem = row.entity;
            showModalDetalles();
        };

        function editar(){
            $state.go("contribs_form", {cnt_id: vm.selectedItem.cnt_id});
        }

        function listar() {
            var res = ContribuyenteServ.get(function () {
                if (res.estado === 200) {
                    vm.gridOptions.columnDefs = res.cols;
                    vm.gridOptions.data = res.items;
                }
            });
        }

        function crear() {
            $state.go("contribs_form", {cnt_id: 0});
        }

        function showModalDetalles() {
            ModalServ.show('modalDetallesContrib');
        }

        function onRowClick(row,rowIndex) {
            ListasServ.limpiaMarca(vm.gridOptions.data);
            if (row.marcado){
                row.marcado =false;
            }
            else{
                row.marcado = true;
            }

            var selectedItem =  ListasServ.getFirstMarcado(vm.gridOptions.data);
            if (selectedItem != null) {
                vm.selectedItem = selectedItem;
            }
            else{
                vm.selectedItem = null;
            }
        }

        /*function onFilaCredClick(row,rowIndex) {
            console.log("onFilaCredClick");
            console.log(row);
            console.log(rowIndex);
        }*/
    }
})();