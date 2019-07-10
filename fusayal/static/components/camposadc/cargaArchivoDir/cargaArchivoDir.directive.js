/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("cargaArchivoDir", cargaArchivoDir);

    function cargaArchivoDir(){
        return {
            restrict: 'EA',
            replace:true,
            scope:{
                form:"=",
                mxsize:'@'//El maximo tamaño de el archivo que se puede subir en kb
            },
            link: function($scope, el){
                el.bind("change", function(e){
                    $scope.file = (e.srcElement || e.target).files[0];
                    var file_size = $scope.file['size'];
                    var leer_archivo = true;
                    if ($scope.form['mxsize']){
                        $scope.mxsize = $scope.form['mxsize'];
                    }
                    if ($scope.mxsize ){
                        var kbsize = file_size/1024.0;
                        if (kbsize>$scope.mxsize){
                            leer_archivo = false;
                            alert("!El tamaño del archivo (" + Math.round(kbsize)+ "kb) sobrepasa el tamaño máximo permitido ("+ $scope.mxsize+ "kb), no se puede cargar!");
                        }
                    }
                    if (leer_archivo){
                        $scope.read_file();
                    }
                    else{
                        $scope.clear_file();
                    }
                })
            },
            controller: "CargaArchivoCntrl",
            template:"<input type='file' class='subir' style='width:100%'/>"
        }
    }
})();