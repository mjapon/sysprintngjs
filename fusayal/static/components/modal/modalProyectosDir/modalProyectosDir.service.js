/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .service("ModalProyectosService", ModalProyectosService);

    function ModalProyectosService($http){
        this.load_proyectos = function($scope){
            var url = '/rest/tproyectos';
            if ($scope.pry_estado === 0){
                url = url+'?byestado='+$scope.pry_estado;
            }

            $http.get(url).then(function(response){
                if (response.data['items']){
                    $scope.proyectos = response.data['items'];
                    $scope.session_pry_codigo = response.data['current_pry_codigo'];
                    for (var ind in $scope.proyectosselecs){
                        for (var ind2 in $scope.proyectos){
                            if($scope.proyectosselecs[ind].pry_codigo === $scope.proyectos[ind2].pry_codigo){
                                $scope.proyectos[ind2].sel=true;
                            }
                        }
                    }
                }
            });

            $http.get('/rest/general/0?opc=appconfig').then(function(rpta){
                if(rpta){
                    $scope.acf_nameproyecto = rpta.data['acf_nameproyecto']
                }
            });
        };
    }

})();