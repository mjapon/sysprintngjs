/**
 * Created by serviestudios on 31/03/16.
 */
(function (module) {
    'use strict';

    module.controller("BuscarefCheckCntrl", BuscarefCheckCntrl);

    function BuscarefCheckCntrl($scope, BaseAutocompServ, GeneralSrv) {

        BaseAutocompServ.config($scope);

        $scope.onkeydown = onkeydown;
        $scope.onkeyup = onkeyup;
        $scope.sel_item = sel_item;
        $scope.on_lost_focus = on_lost_focus;
        $scope.onCheckClick =  onCheckClick;

        $scope.$watch("model",
            function( newValue, oldValue ) {
                BaseAutocompServ.on_model_change($scope);
            }
        );

        init();

        function init(){
            if (!$scope.setup.labelCheck){
                $scope.setup.labelCheck = "setlabelcheck";
            }
            $scope.idbtncheck = 'btncheck_' + Math.random();//Id del input
            if ($scope.setup.idbtncheck){
                $scope.idbtncheck = $scope.setup.idbtncheck;
            }
        }

        function onCheckClick(){
            $scope.ischeck = $scope.ischeck?false:true;
            if ($scope.ischeck){
                GeneralSrv.setFocusWithTimeout($scope.setup.idprop, 100);
            }
        }

        function onkeydown(event){
            BaseAutocompServ.onkeydown($scope,event);
        }

        function onkeyup(event){
            BaseAutocompServ.onkeyup($scope, event);
        }

        function sel_item(item){
            BaseAutocompServ.sel_item($scope, item);
        }

        function on_lost_focus(item){
            BaseAutocompServ.on_lost_focus($scope);
        }
    }

})(IsyplusApp);