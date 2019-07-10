(function () {
    'use strict';
    angular.module("isyplus")
        .controller("UsuariosCntrl", UsuariosCntrl);

    function UsuariosCntrl($scope, $state, $transitions, LoginServ, NotifServ, gridService){

        var vm = $scope;

        vm.items = [];
        vm.listar = listar;
        vm.crear = crear;
        vm.editar = editar;
        vm.resetearClave = resetearClave;
        vm.cambiarEstado = cambiarEstado;

        vm.selectedItem = {};

        gridService.initGrid(vm);

        init();

        function init(){
            listar();
        }

        function listar() {
            var res = LoginServ.listar(function(){
                if (res.estado === 200){
                    $scope.gridOptions.columnDefs = res.cols;
                    $scope.gridOptions.data = res.items;
                }
            });
        }

        function crear() {
            $state.go("usuarios_form", {userid:0, accion:'c'});
        }

        function editar(){
            $state.go("usuarios_form", {userid:vm.selectedItem.us_id, accion:'e'});
        }

        function resetearClave(){
            $state.go("usuarios_form", {userid:vm.selectedItem.us_id, accion:'r'});
        }

        function cambiarEstado(){
            var msg = "¿Seguro que desea dar de baja este usuario?";
            if (vm.selectedItem.us_status ===1){
                msg = "¿Seguro que desea activar este usuario?";
            }

            if (confirm(msg)){
                var res = LoginServ.cambiarEstado(vm.selectedItem, function(){
                    if (res.estado === 200){
                        NotifServ.success(res.msg);
                        listar();
                    }
                });
            }
        }
    }

})();