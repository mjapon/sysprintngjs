/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("PropiedadAdcDirCntrl", PropiedadAdcDirCntrl);

    function PropiedadAdcDirCntrl($scope, $timeout){

        $scope.quitar_imagen = function(){
            console.log("quitar imagen");
            var aux_form = {};
            angular.copy($scope.form, aux_form);
            $scope.form = {
                progress:0,
                name:'',
                size:'',
                type:'',
                src:''
            };

            $timeout(function(){
                for(var prop in aux_form) {
                    console.log(prop);
                    if (prop === 'src'){
                        //console.log("prop is src, no se establece en form");
                    }
                    else{
                        $scope.form[prop] = aux_form[prop];
                    }
                }
            }, 400);
        }
    }
})();