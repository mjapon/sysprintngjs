/**
 * Created by serviestudios on 31/03/16.
 */
(function (module) {
    'use strict';

    module.directive("serviBuscarefCheck", serviBuscarefCheck);

    function serviBuscarefCheck(){
        return {
            restrict: 'EA',
            scope:{
                tipo:'@',
                data:'=',
                model:'=',
                ischeck: '=',
                uri:'@',
                setup:'=',
                onlistaclick:'&'
            },
            controller:'BuscarefCheckCntrl',
            templateUrl:"static/components/referente/serviBuscarefCheck/serviBuscarefCheck.html?v=" + globalgsvapp
        }
    }

})(IsyplusApp);