/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("CargaArchivoCntrl", CargaArchivoCntrl);

    function CargaArchivoCntrl($scope, CustomFileReader){
        $scope.read_file = function(){
            $scope.form.progress = 0;
            $scope.form.name = $scope.file['name'];
            $scope.form.size = $scope.file['size'];
            $scope.form.type = $scope.file['type'];
            CustomFileReader.readAsDataUrl($scope.file, $scope)
                .then(function(result) {
                    $scope.form.src = result;
                });
        }
        $scope.clear_file = function(){
            $scope.form = {progress:0,
                name:'',
                size:'',
                type:'',
                src:''};
        }
    }

})();