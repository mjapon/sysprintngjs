(function () {
    'use strict';
    angular.module("isyplus")
        .config(configAutList);

    function configAutList($stateProvider) {
        $stateProvider.state('auts_list',{
            url : '/autorizacion',
            templateUrl: 'static/app/autorizacion/autorizacion.list.html?v=' + globalgsvapp,
            controller: 'AutorizacionCntrl'
        });
    }
})();