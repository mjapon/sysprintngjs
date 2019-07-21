(function () {
    'use strict';
    angular.module("isyplus")
        .controller("JobViewCntrl", JobViewCntrl);

    function JobViewCntrl($scope, $stateParams, $state, JobService, focusService,
                          NotifServ, ReportesServ, swalService, ModalServ, JobRPService, Upload,GeneralSrv) {
        var vm = $scope;

        vm.formContrib = {};
        vm.formAut = {};
        vm.formJob = {};
        vm.formReprint = {jobrp_id:0};

        vm.isVistaPrevia = false;

        vm.repgrid = {};
        vm.repgrid.selectedItem = {};

        vm.submit = submit;
        vm.upload = upload;

        vm.anular = anular;
        vm.plantilla = plantilla;
        vm.cargaManual = cargaManual;
        vm.reimprimir = reimprimir;
        vm.reportar = reportar;
        vm.goLista = goLista;
        vm.okModalSelPlantilla = okModalSelPlantilla;
        vm.selectPlantilla = selectPlantilla;
        vm.vistaPrevia = vistaPrevia;
        vm.imprimir = imprimir;
        vm.setInputFocus = setInputFocus;
        vm.okModalReimprimir = okModalReimprimir;
        vm.marcarIncompleto = marcarIncompleto;
        vm.verReporteGen = verReporteGen;

        vm.ipServer = GeneralSrv.getIPServer();

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

        function setInputFocus(inputid) {
            focusService.setFocus(inputid);
        }

        function goLista() {
            $state.go('job_list');

        }

        function anular() {
            cambiarEstado('¿Seguro que desea anular el documento?', 4);
        }
        
        function plantilla() {
            showModalSetPlantilla();
        }
        
        function cargaManual() {
            ModalServ.show('modalCargaManual');
        }
        
        function reimprimir(){
            showModalReimprimir();
        }
        
        function reportar() {
            cambiarEstado('¿Esta seguro?', 2);
        }

        function imprimir(){
            var codTipoPrint = 2;
            auxImprimir(codTipoPrint);
            auxCambiarEstado(6, false);
        }

        function vistaPrevia(){
            console.log('vista previa-->');
            var codTipoPrint = 1;
            auxImprimir(codTipoPrint);
            vm.isVistaPrevia = true;
        }

        function showModalReimprimir(){
            vm.formReprint = {jobrp_id: 0, job_id:vm.formJob.job_id, jobrp_obs: '', jobrp_secini: '', jobrp_secfin: ''};
            ModalServ.show('modalReprint');
        }

        function okModalReimprimir(){
            var res = JobRPService.save(vm.formReprint, function () {
                if (res.estado == 200) {

                    verReporteGen();
                    //auxImprimir(1);
                    NotifServ.success(res.msg);
                    ModalServ.hide('modalReprint');
                    auxCambiarEstado(5);
                }
            });
        }

        function auxCambiarEstado(newEstado, notif) {
            var params = {
                job_id: vm.formJob.job_id,
                newestado: newEstado
            };
            var res = JobService.cambiarEstado(params, function () {
                if (res.estado === 200) {
                    if (notif) {
                        NotifServ.success(res.msg);
                    }
                    getDatosJob();
                }
            });
        }

        function cambiarEstado(msgPregunta, estado) {
            swalService.confirm(msgPregunta, function (confirm) {
                if (confirm) {
                    var params = {
                        job_id: vm.formJob.job_id,
                        newestado: estado
                    };
                    var res = JobService.cambiarEstado(params, function () {
                        if (res.estado === 200) {
                            NotifServ.success(res.msg);
                            getDatosJob();
                        }
                    });
                }
            }, 'Cambiar estado del documento');
        }

        function selectPlantilla(plantilla) {
            vm.repgrid.selectedItem = plantilla;
        }

        function okModalSelPlantilla() {
            console.log(vm.repgrid.selectedItem);
            var res = JobService.putPlantilla({
                job_id: vm.formJob.job_id,
                temp_id: vm.repgrid.selectedItem.temp_id
            }, function () {
                if (res.estado == 200) {
                    NotifServ.success(res.msg);
                    ModalServ.hide('modalSelPlant');
                    auxCambiarEstado(7);
                }
            });
        }

        function auxImprimir(tipocopia) {
            console.log('tipocopia');
            console.log(tipocopia);
            var temp_id = vm.formJob.temp_id;
            var desde = vm.formJob.job_secuencia_ini;
            var hasta = vm.formJob.job_secuencia_fin;
            var jobid = vm.formJob.job_id;
            var url = "http://"+vm.ipServer+":8080/imprentas/ReporteServlet?desde=" + desde + "&hasta=" + hasta + "&codrep=" + temp_id + "&tipocopia=" + tipocopia + "&jobid=" + jobid+"&emp_esquema="+globalEmpEsquema;
            console.log('url-->');
            console.log(url);
            window.open(url, "mywindow", "status=1,toolbar=1");
        }

        function showModalSetPlantilla() {
            var res = ReportesServ.get(function () {
                if (res.status === 200) {
                    vm.repgrid.columnDefs = res.cols;
                    vm.repgrid.data = res.items;

                    getDatosJob();

                }
                ModalServ.show('modalSelPlant');
            });
        }
        
        function marcarIncompleto() {
            cambiarEstado('¿Seguro que desea marcar como incompleto este documento?', 3);
        }


        function submit(){ //function to call on form submit
            console.log('Se ejecuta submit');
            console.log('vm.upload_form');
            console.log(vm.upload_form);
            console.log(vm.upload_form.file.$valid && vm.file);
            if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                upload(vm.file); //call upload function
            }
        }

        function verReporteGen(){
            var url = "http://"+vm.ipServer+":8080/imprentas/DescargaReportServlet?codjob=" + vm.formJob.job_id+"&emp_esquema="+globalEmpEsquema;
            console.log('url-->');
            console.log(url);
            window.open(url, "mywindow", "status=1,toolbar=1");
        }

        function upload (file) {
            Upload.upload({
                url: 'http://'+vm.ipServer+':6543/uploadjobview', //webAPI exposed to upload the filefilename
                data:{file:file, job_id: vm.formJob.job_id, 'nombreArchivo':'pruebaNombreArchivo', 'filename':'pruebafilename'} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                console.log('Respuesta del servidor');
                console.log(resp);
                if(resp.data.estado === 200){ //validate success
                    swalService.success(resp.data.msg);
                    auxCambiarEstado(6, false);
                    ModalServ.hide('modalCargaManual');

                } else if (resp.data.estado === -1) {
                    swalService.warning(resp.data.msg);
                    //$window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                //$window.alert('Error status: ' + resp.status);
                swalService.error('Error status: ' +resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };

    }

})();