/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .controller("BusRetDirectCntrl", BusRetDirectCntrl);

    function BusRetDirectCntrl($scope, BaseAutocompServ) {
        BaseAutocompServ.config($scope);

        $scope.onkeydown = function(event){
            BaseAutocompServ.onkeydown($scope,event);
        }

        $scope.onkeyup = function(event){
            BaseAutocompServ.onkeyup($scope, event);
        }

        $scope.sel_item = function(item){
            BaseAutocompServ.sel_item($scope, item);
        }

        $scope.on_lost_focus = function(item){
            BaseAutocompServ.on_lost_focus($scope);
        }

        $scope.$watch("model",
            function( newValue, oldValue ) {
                BaseAutocompServ.on_model_change($scope);
            }
        );
    }
})();