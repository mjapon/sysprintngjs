(function () {
    'use strict';

    angular.module("isyplus")
        .config(jobConfig);
    function jobConfig($stateProvider) {
        $stateProvider.state('reportes_sys',{
            url : '/reportessys',
            templateUrl: 'static/app/reportessys/reportessys.html?v=' + globalgsvapp,
            controller: 'ReportesSysCntrl'
        });
    }



})();