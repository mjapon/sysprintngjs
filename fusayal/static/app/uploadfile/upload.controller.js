(function () {
    'use strict';
    angular.module("isyplus")
        .controller("UploadCntrl", UploadCntrl);

    function UploadCntrl($scope, NotifServ, $state, $stateParams, ReportesServ) {
        var vm = $scope;
        vm.form = {nombreArchivo: 'prueba'};
        init();

        vm.cancelar = cancelar;

        function init() {
            var temp_id = $stateParams['temp_id'];
            var int_tempid = parseInt(temp_id, 10);
            console.log(int_tempid);
            if ( int_tempid == 0) {
                vm.form = {temp_id:0, temp_name: ''};
            }
            else{
                var res = ReportesServ.get({temp_id: temp_id}, function () {
                    if (res.status == 200) {
                        vm.form = res.form;
                    }
                });
            }
        }

        function cancelar() {
            // NotifServ.info('Accion cancelar ejecutado');
            $state.go("reportes_list");
        }
    }

})();