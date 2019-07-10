/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("ModalDetallesArtCntrl", ModalDetallesArtCntrl);

    function ModalDetallesArtCntrl($scope, $http, ModalServ) {
        $scope.datos = {};
        $scope.adicionales = [];

        $scope.show_modal = function () {
            ModalServ.show($scope.elementid);
        }

        $scope.load_datos_articulo = function () {
            var self = this;
            $http.get("/rest/transacc/articulo/" + $scope.artcodigo + "?tipo=" + $scope.tipo_arts).then(function (response) {
                if (response.data['articulo']) {
                    $scope.datos = response.data['articulo'];
                    $scope.adicionales = response.data['adicionales'];
                    self.show_modal();
                }
                else {
                    alert("Error al tratar de obtener los detalles del artículo");
                }
            })
        }

        $scope.$on('show_modal_detalles_art_event', function (event, data) {
            $scope.artcodigo = data['art_codigo'];
            $scope.tipo_arts = data['tipo_arts'];
            $scope.load_datos_articulo();
        });
    }

})();