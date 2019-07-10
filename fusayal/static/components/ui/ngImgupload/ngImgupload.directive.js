/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngImgupload", ngImgupload);

    function ngImgupload($timeout){
    return {
        restrict: 'E',
        templateUrl: "static/components/ui/ngImgupload/ngImgupload.html?v="+ globalgsvapp,
        scope: {
            model: '=',
            imgsrc: '@'
        },
        link: function(scope, element, attributes){
            scope.form = {};
            scope.form.rutaimg = 'static/img/public/logo_isyplus_reducido.png';
            scope.form.imagen = document.getElementById("img");

            if (scope.model && scope.model !== '') {
                scope.form.imagen.src = scope.model;
            } else if (scope.imgsrc) {
                scope.form.imagen.src = scope.imgsrc;
            } else {
                scope.form.imagen.src = scope.form.rutaimg;
            }
            scope.setFile = function () {
                var oFReader = new FileReader();
                oFReader.readAsDataURL(document.getElementById("inputimg").files[0]);
                oFReader.onload = function (oFREvent) {
                    scope.$apply(function () {
                        scope.model = oFREvent.target.result;
                        scope.form.imagen.src = scope.model;
                    });
                };
            };
            scope.quitaImagen = function(){
                $timeout(function(){
                    scope.$apply(function () {
                        scope.model = '';
                        scope.form.imagen.src  = scope.form.rutaimg;
                    });
                },0);
            };
        }
    }
}


})();