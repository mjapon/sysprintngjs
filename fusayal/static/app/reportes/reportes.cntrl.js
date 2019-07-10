(function () {
    'use strict';
    angular.module("isyplus")
        .controller("ReportesCntrl", ReportesCntrl);

    function ReportesCntrl($scope, ReportesServ, gridService, $state) {

        var vm = $scope;

        vm.listar = listar;
        vm.crear = crear;
        vm.editar = editar;

        vm.selectedItem = {};

        gridService.initGrid(vm);

        init();

        function init() {
            console.log("Reportes Cntrl Init executed-->");
            listar();
        }

        function listar(){
            console.log('Se ejecuta accion listar');

            var res = ReportesServ.get(function(){
                if (res.status === 200){
                    $scope.gridOptions.columnDefs = res.cols;
                    $scope.gridOptions.data = res.items;
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

        function crear() {
            $state.go('upload',{temp_id:0});
        }

        function editar() {
            $state.go('upload',{temp_id:vm.selectedItem.temp_id});
        }
    }

})();