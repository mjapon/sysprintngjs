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
                    loadDatosEmpresa(false);
                }
            });
        }

        function cancelar() {
            $state.go("home");
        }

        function init() {
            loadDatosEmpresa(true);
        }

        function loadDatosEmpresa(showmsgs){
            var res = EmpresaServ.get({emp_id:0}, function(){
                if (res.tempresa){
                    vm.form = res.tempresa;
                    if (vm.form.emp_id ===0){
                        if (showmsgs) {
                            NotifServ.warning("El establecimiento grafico, no ha sido parametrizado");
                        }
                    }
                    else{
                        if (showmsgs) {
                            NotifServ.warning("El establecimiento grafico, ya ha sido parametrizado");
                        }
                    }
                }
            });
        }
    }

})();