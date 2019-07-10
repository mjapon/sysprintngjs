(function () {
    'use strict';
    angular.module("isyplus")
        .controller("JobStepsCntrl", JobStepsCntrl);

    function JobStepsCntrl($scope, JobService, gridService, $state, ModalServ, NotifServ, swalService,
                           ReportesServ, ListasServ, FechasServ, ContribuyenteServ, focusService, AutorizacionServ) {

        var vm = $scope;
        vm.currentStep = 1;
        vm.formContrib = {};
        vm.formAut = {};
        vm.formJob = {};
        vm.tiposcontrib = [];
        vm.listas ={tiposdoc:[]};
        vm.existeContrib = false;
        vm.contribFinded = false;//Indica si se busco el contribuyente

        vm.onEnterFindContrib = onEnterFindContrib;
        vm.onFocusContribRazonSocial= onFocusContribRazonSocial;
        vm.findContrib = findContrib;
        vm.guardarContrib = guardarContrib;
        vm.guardarAutorizacion = guardarAutorizacion;
        vm.guardarJob = guardarJob;
        vm.onenterfecha = onenterfecha;
        vm.anterior = anterior;

        function init() {
            console.log("init jobsteps-->");
            vm.currentStep = 1;
            initFormContrib();
        }

        function initFormContrib() {
            var res = ContribuyenteServ.getForm({cnt_id: 0}, function () {
                if (res.estado === 200) {
                    vm.formContrib = res.form;
                    vm.tiposcontrib = res.tiposcontrib;
                }
            });
            focusService.setFocus("cnt_ruc", 500);
        }

        function goToStep2(){
            initFormAut();
        }

        function goToStep3() {
            initFormJob();
        }

        function initFormAut() {
            var res =AutorizacionServ.getFormStep({aut_id:0, cnt_id: vm.formContrib.cnt_id}, function () {
                console.log("Respuesta al obtener la autorizacion");
                console.log(res);

                if (res.estado == 200){
                    vm.formAut = res.form;
                    vm.listas.tiposdoc = res.tiposdoc;
                }
            } );
        }

        function initFormJob() {
             var jobid = 0;
             var res = JobService.getJustForm({job_id:jobid}, function () {
                 if (res.estado === 200){
                     vm.formJob = res.form;
                     //focusService.setFocus('ruccontrib', 500);
                 }
             });
        }

        function onEnterFindContrib(){
            findContrib();
        }

        function onFocusContribRazonSocial(){
            console.log("on onFocusContribRazonSocial-->")
        }

        function findContrib() {
            vm.contribFinded = true;
            if (vm.formContrib.cnt_ruc.length > 10) {
                var res = ContribuyenteServ.findByRuc({ruc: vm.formContrib.cnt_ruc}, function () {
                    if (res.estado === 200) {
                        NotifServ.warning('El contribuyente ya esta registrado');
                        vm.formContrib = res.contrib;
                        vm.existeContrib = true;
                    } else if (res.estado === 404) {
                        NotifServ.info('El contribuyente no está registrado');
                        focusService.setFocus("cnt_razonsocial", 100);
                    }
                });
            }
        }

        function guardarContrib() {
            console.log("guardar contrib------->");
            var res = ContribuyenteServ.save(vm.formContrib, function () {
                if (res.estado === 200) {
                    NotifServ.success(res.msg);
                    vm.currentStep = 2;
                    goToStep2();
                }
            });
        }

        function guardarAutorizacion() {
             var res = AutorizacionServ.save(vm.formAut, function(){
                if (res.estado === 200){
                    NotifServ.success(res.msg);
                    vm.currentStep = 3;
                    goToStep3();
                }
            });
        }

        function goToJobList(){
             $state.go("job_list");
        }

        function guardarJob() {
            var res = JobService.save(vm.formJob, function () {
                 if (res.estado === 200){
                     NotifServ.success(res.msg);
                     goToJobList();
                 }
             });
        }

        function anterior() {
            NotifServ.info("back action->");
        }

         function  onenterfecha( ) {
            console.log("on enter fecha");
            console.log(vm.formAut.aut_fechaautorizacion);
            var res =  FechasServ.sumar_anios(vm.formAut.aut_fechaautorizacion,1);
            console.log("new fecha:");
            console.log(res);
            vm.formAut.aut_fechacaducidad = res;
        }

        init();
    }


})();