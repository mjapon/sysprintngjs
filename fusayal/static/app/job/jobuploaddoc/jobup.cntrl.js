(function () {
    'use strict';
    angular.module("isyplus")
        .controller('JobUpCntrl', JobUpCntrl);

    function JobUpCntrl($scope, $window, Upload, swalService) {

        var vm = $scope;

        vm.submit = submit;
        vm.upload = upload;

        function init(){
            console.log('init up cntrl--->');
        }

        init();

        function submit(){ //function to call on form submit
            console.log('Se ejecuta submit');
            console.log('vm.upload_form');
            console.log(vm.upload_form);
            console.log(vm.upload_form.file.$valid && vm.file);
            if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                upload(vm.file); //call upload function
            }
        }

        function upload (file) {
            Upload.upload({
                url: 'http://localhost:6543/uploadjobview', //webAPI exposed to upload the filefilename
                data:{file:file, job_id:0, 'nombreArchivo':'pruebaNombreArchivo', 'filename':'pruebafilename'} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                console.log('Respuesta del servidor');
                console.log(resp);
                if(resp.data.estado === 200){ //validate success
                    swalService.success(resp.data.msg);
                    //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.msg);
                } else if (resp.data.estado === -1) {
                    swalService.warning(resp.data.msg);
                    //$window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
                swalService.error(resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };

    }


})();