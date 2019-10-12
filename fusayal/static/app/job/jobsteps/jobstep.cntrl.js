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
        vm.formAutSaved = {};
        vm.formJob = {};
        vm.tiposcontrib = [];
        vm.autsContribList = [];
        vm.listas = {tiposdoc: []};
        vm.existeContrib = false;
        vm.contribFinded = false;//Indica si se busco el contribuyente
        vm.numautFinded = false;

        vm.init = init;
        vm.onEnterFindContrib = onEnterFindContrib;
        vm.onFocusContribRazonSocial = onFocusContribRazonSocial;
        vm.findContrib = findContrib;
        vm.guardarContrib = guardarContrib;
        vm.guardarAutorizacion = guardarAutorizacion;
        vm.guardarJob = guardarJob;
        vm.onenterfecha = onenterfecha;
        vm.anterior = anterior;
        vm.setInputFocus = setInputFocus;
        vm.buscarAutorizacion = buscarAutorizacion;
        vm.onBlurNumAutorizacion = onBlurNumAutorizacion;

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

        function goToStep2() {
            initFormAut();
        }

        function goToStep3() {
            initFormJob();
        }

        function initFormAut() {
            var res = AutorizacionServ.getFormStep({aut_id: 0, cnt_id: vm.formContrib.cnt_id}, function () {
                if (res.estado == 200) {
                    vm.formAut = res.form;
                    vm.listas.tiposdoc = res.tiposdoc;
                    focusService.setFocus('aut_numero', 100);


                    var res2 = AutorizacionServ.getContribAuts({cnt_id: vm.formContrib.cnt_id}, function () {
                        if (res2.estado == 200) {
                            vm.autsContribList = res2.items;//editado
                        }
                    });

                }
            });
        }

        function buscarAutorizacion() {
            console.log('buscar autorizacion--->');
            vm.numautFinded = false;
            if (vm.formAut.aut_numero.length > 5) {
                var res = AutorizacionServ.getByNumAndRuc({
                    cnt_ruc: vm.formContrib.cnt_ruc,
                    aut_numero: vm.formAut.aut_numero
                }, function () {
                    console.log('Respuesta del servidor es');
                    console.log(res);
                    if (res.estado === 200) {
                        vm.formAut = res.aut;
                        vm.numautFinded = true;
                    }
                    focusService.setFocus('aut_serie', 100);//
                });
            }
        }

        function initFormJob() {
            var jobid = 0;
            var res = JobService.getJustForm({job_id: jobid}, function () {
                if (res.estado === 200) {
                    vm.formJob = res.form;
                    focusService.setFocus('job_ptoemi');
                }
            });
        }

        function onEnterFindContrib() {
            findContrib();
        }

        function onFocusContribRazonSocial() {
            console.log("on onFocusContribRazonSocial-->")
            if (!vm.contribFinded) {
                findContrib();
            }
        }

        function findContrib() {
            vm.contribFinded = true;
            if (vm.formContrib.cnt_id > 0) {
                initFormContrib();
            } else if (vm.formContrib.cnt_ruc.length > 10) {
                var res = ContribuyenteServ.findByRuc({ruc: vm.formContrib.cnt_ruc}, function () {
                    if (res.estado === 200) {
                        NotifServ.info('El contribuyente ya esta registrado');
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
            var res = ContribuyenteServ.save(vm.formContrib, function () {
                if (res.estado === 200) {
                    //NotifServ.success(res.msg);
                    var cnt_id = res.cnt_id;
                    vm.formContrib.cnt_id = cnt_id;
                    vm.currentStep = 2;
                    goToStep2();
                }
            });
        }

        function guardarAutorizacion() {
            var res = AutorizacionServ.save(vm.formAut, function () {
                if (res.estado === 200) {
                    //NotifServ.success(res.msg);
                    var aut_id = res.aut_id;
                    console.log("aut_id generado:");
                    console.log(aut_id);

                    var res2 = AutorizacionServ.get({aut_id: aut_id}, function () {
                        console.log('res2 es:');
                        console.log(res2);
                        if (res2.estado === 200) {
                            console.log('form generado es');
                            console.log(res2.form);
                            vm.formAutSaved = res2.form;
                            console.log('formaut save es:');
                            console.log(vm.formAutSaved);
                            //editado
                        }
                    });

                    vm.currentStep = 3;
                    goToStep3();
                }
            });
        }

        function goToJobList() {
            $state.go("job_list");
        }

        function guardarJob() {

            vm.formJob.aut_id = vm.formAutSaved.aut_id;
            vm.formJob.cnt_id = vm.formContrib.cnt_id;
            console.log('Dats enviados');
            console.log(vm.formJob);

            //Validar las secuencias ingresadas
            console.log("Valores de las secuencias:");
            console.log(vm.formJob.job_secuencia_ini);
            console.log(vm.formJob.job_secuencia_fin);

            if (vm.formJob.job_secuencia_ini > 999999999) {
                NotifServ.warning('El valor de la secuencia inicial es incorrecto, el máximo valor permitido es 999999999');
            } else if (vm.formJob.job_secuencia_fin > 999999999) {
                NotifServ.warning('El valor de la secuencia final es incorrecto, el máximo valor permitido es 999999999');
            } else {
                var res = JobService.save(vm.formJob, function () {
                    if (res.estado === 200) {
                        var job_id_gen = res.job_id;
                        NotifServ.success(res.msg);
                        goToJobView(job_id_gen);
                    }
                });
            }
        }

        function anterior(step) {
            //NotifServ.info("back action->");
            vm.currentStep = step;
        }

        function onenterfecha() {
            var res = FechasServ.sumar_anios(vm.formAut.aut_fechaautorizacion, 1);
            vm.formAut.aut_fechacaducidad = res;
        }

        function setInputFocus(inputid) {
            focusService.setFocus(inputid);
        }

        function goToJobView(job_id) {
            $state.go('job_view', {job_id: job_id});
        }

        function onBlurNumAutorizacion() {
            console.log("On blur num autorizarion")
            if (!vm.numautFinded) {
                buscarAutorizacion();
            }
        }

        init();
    }


})();