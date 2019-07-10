(function () {
    'use strict';
    angular.module("isyplus")
        .controller("LoginCntrl", LoginCntrl);
    function LoginCntrl($scope, $state, LoginServ, NotifServ){
        var vm = $scope;

        vm.form = {};
        vm.autenticar = autenticar;
        vm.checkUserStatus = checkUserStatus;
        init();

        function init(){
            console.log("Init login cntrl");
            vm.form = {
                usuario:'',
                clave:''
            }
        }

        function autenticar(){
            console.log("Se ejecuta el metodo de autenticacion-->");
            var res = LoginServ.save(vm.form, function(){
                if (res.estado == 200){
                    if (res.resultado){
                        NotifServ.info("Login exitoso");
                        $state.go("home");
                    }
                    else{
                        NotifServ.error("Login fallido");
                    }
                }
            })
        }

        function checkUserStatus(){
            console.log("Se ejecuta checkUserStatus-->");
            var res = LoginServ.chkStatus(function(){
                console.log("Valor de res es:");
                console.log(res);
                if (res.userloged){
                    NotifServ.info("Usuario en sesion");
                }
                else{
                    NotifServ.error("Usuario no esta en sesion");
                }
            })

        }

    }
})();