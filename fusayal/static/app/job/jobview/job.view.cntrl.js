(function () {
    'use strict';
    angular.module("isyplus")
        .controller("JobViewCntrl", JobViewCntrl);

    function JobViewCntrl($scope, $stateParams, JobService) {
        var vm = $scope;

        vm.formContrib = {};
        vm.formAut = {};
        vm.formJob = {};

        vm.anular = anular;
        vm.plantilla = plantilla;
        vm.cargaManual = cargaManual;
        vm.reimprimir = reimprimir;
        vm.reportar = reportar;

        init();
        
        function init() {
            console.log('init JobViewCntrl');
            getDatosJob();
        }

        function getDatosJob(){
            var job_id = $stateParams.job_id;
            var res = JobService.getAllInfo({job_id:job_id}, function () {
                console.log('respuesta del servidor es');
                console.log(res);
                if (res.estado === 200) {
                    vm.formJob = res.form_job;
                    vm.formAut = res.form_aut;
                    vm.formContrib = res.form_contrib;
                }
            });
        }

        function anular() {

        }
        
        function plantilla() {
            
        }
        
        function cargaManual() {
            
        }
        
        function reimprimir(){
            
        }
        
        function reportar() {
            
        }
        



    }

})();