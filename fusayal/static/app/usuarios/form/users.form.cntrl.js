(function () {
    'use strict';
    angular.module("isyplus")
        .controller("UserFormCntrl", UserFormCntrl);

    function UserFormCntrl($scope, $state, $stateParams, NotifServ, LoginServ, focusService, RolesServ){

        var vm = $scope;

        vm.form = {us_id:0};
        vm.guardar = guardar;
        vm.cancelar = cancelar;
        vm.accion = 'c';
        vm.titulo = "Creación de usuario";
        vm.matrizRoles = [];

        init();

        function init(){
            initForm();
        }

        function initForm(){
            vm.accion = $stateParams.accion;
            switch (vm.accion) {
                case 'c': vm.titulo = "Creación de usuario";break;
                case 'e': vm.titulo = "Actualización de usuario";break;
                case 'r': vm.titulo = "Reseteo de clave";break;
                default: vm.titulo = "Creación de usuario";break;
            }

            if (parseInt($stateParams.userid)>0){
                var res = LoginServ.get({us_id:$stateParams.userid},function(){
                    if (res.estado == 200){
                        vm.form = res.user;
                    }
                });
            }
            else{
                var res = LoginServ.getForm(function(){
                    if (res.estado == 200){
                        vm.form = res.form;
                    }
                });
            }

            if (vm.accion === 'r'){
                focusService.setFocusTimeout("claveTempInput", 500);
            }
            else{
                focusService.setFocusTimeout("nomApelUser", 500);

                if (vm.accion == 'c' || vm.accion == 'e'){
                    listarRoles();
                }
            }

        }

        function guardar(){
            if (vm.form.us_id === 0){
                vm.form.roles = vm.matrizRoles;
                var res = LoginServ.crearUsuario(vm.form, function(){
                   if (res.estado == 200){
                       NotifServ.success(res.msg);
                       goToList();
                   }
                });
            }
            else{
                if (vm.accion === 'r'){
                    var res = LoginServ.resetClave(vm.form, function(){
                        if (res.estado === 200){
                            NotifServ.success(res.msg);
                            goToList();
                        }
                    });
                }
                else{
                    vm.form.roles = vm.matrizRoles;
                    var res = LoginServ.save(vm.form, function(){
                        if (res.estado === 200){
                            NotifServ.success(res.msg);
                            goToList();
                        }
                    });
                }

            }
        }

        function listarRoles() {
            vm.matrizRoles = [];
            vm.form.us_id=$stateParams.userid;
            var res = RolesServ.get(vm.form, function(){
                console.log("respuesta del servidor es:");
                if (res.estado==200){
                    vm.matrizRoles = res.matriz;
                }
            });
        }

        function goToList(){
            $state.go("usuarios");
        }

        function cancelar(){
            goToList();
        }
    }
})();