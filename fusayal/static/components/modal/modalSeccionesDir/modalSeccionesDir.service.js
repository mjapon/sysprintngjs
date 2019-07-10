/**
 * Created by yesica on 23/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .service("ModalSeccionesService", ModalSeccionesService);

    function ModalSeccionesService($http){
        this.load_secciones = function($scope){
            var url = '/rest/tseccion?opc=allsecAndAlm';

            $http.get(url).then(function(response){
                if (response.data['estado']==1){
                    $scope.secciones = response.data['seccionesls'];
                    var ind = 0;
                    var ind2 = 0;
                    for (ind ; ind < $scope.seccionesselecs.length ; ind++){
                        ind2 = 0;
                        for (ind2 ; ind2 < $scope.secciones.length; ind2++){
                            if($scope.seccionesselecs[ind].sec_codigo === $scope.secciones[ind2].sec_codigo){
                                $scope.secciones[ind2].sel=true;
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
