/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .service("ModalCelebrantesService", ModalCelebrantesService);

    function ModalCelebrantesService($http){
        this.load_celebrantes = function($scope){
            console.log("carga celebrantes")
            var url = '/rest/celebrante/lsceleb';
            if ($scope.celb_estado === 0){
                url = url+'?byestado='+$scope.celb_estado;
            }
            $http.get(url).then(function(response){
                if (response.data['lstcelebrantes']){
                    $scope.celebrantes = response.data['lstcelebrantes'];
                    //marcar con check los celebrantes seleccionados
                    for (var ind in $scope.celebrantesselecs){
                        for (var ind2 in $scope.celebrantes){
                            if($scope.celebrantesselecs[ind].celb_codigo === $scope.celebrantes[ind2].celb_codigo){
                                $scope.celebrantes[ind2].sel=true;

                            }
                        }

                    }
                    //marcar con check solo un  celebrante seleccionados
                    if($scope.current_celb_codigo !=0){
                        for (var ind2 in $scope.celebrantes){
                            if($scope.celebrantes[ind2].celb_codigo===$scope.current_celb_codigo){
                                $scope.celebrantes[ind2].sel=true;
                                break;
                            }
                        }
                    }
                }
            });
        };
        this.cambiarestadoCelebrante = function(cod, estado){
            var url = '/rest/celebrante/lsceleb/'+cod+'?opc=cambiarestado&estado='+estado;
            return $http.post(url);
        };
        this.guardarCelebrante = function(id,celebrante){
            var cod = id||0;
            return $http.post("/rest/celebrante/lsceleb/"+cod,celebrante);
        };
        this.getCelebrante = function(id, $scope){
            console.log("entra obtener celebrante")
            $http.get('/rest/celebrante/lsceleb/'+id).then(function(rpta){
                $scope.celb_nvo = rpta.data.celebrante;
                $scope.celb_edit = rpta.data.celebrante;
            });
        };
    }

})();