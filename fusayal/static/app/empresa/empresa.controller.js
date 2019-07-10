(function () {
    'use strict';
    angular.module("isyplus")
        .controller("EmpresaCntrl", EmpresaCntrl);

    function EmpresaCntrl($scope, NotifServ, EmpresaServ, $state) {

        var vm = $scope;
        vm.form ={'emp_id':0};

        vm.guardar = guardar;
        vm.canclear = cancelar;

        init();

        function guardar() {
            var res = EmpresaServ.save(vm.form, function(){
                if (res.estado === 200){
                    NotifServ.success(res.msg);
                    loadDatosEmpresa();
                }
            });
        }

        function cancelar() {
            $state.go("home");
        }

        function init() {
            loadDatosEmpresa();
        }

        function loadDatosEmpresa(){
            var res = EmpresaServ.get({emp_id:0}, function(){
                if (res.tempresa){
                    vm.form = res.tempresa;
                    if (vm.form.emp_id ===0){
                        NotifServ.warning("El establecimiento grafico, no ha sido parametrizado");
                    }
                    else{
                        NotifServ.warning("El establecimiento grafico, ya ha sido parametrizado");
                    }
                }
            });
        }
    }

})();