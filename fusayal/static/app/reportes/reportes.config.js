(function () {
    'use strict';

    angular.module("isyplus")
        .config(jobConfig);
    function jobConfig($stateProvider) {
        $stateProvider.state('reportes_list',{
            url : '/reportes',
            templateUrl: 'static/app/reportes/reportes.list.html?v=' + globalgsvapp,
            controller: 'ReportesCntrl'
        });
    }



})();