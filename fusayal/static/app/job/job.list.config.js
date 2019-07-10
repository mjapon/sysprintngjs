(function () {
    'use strict';
    angular.module("isyplus")
        .config(jobConfig);
    function jobConfig($stateProvider) {
        $stateProvider.state('job_list',{
            url : '/job',
            templateUrl: 'static/app/job/job.list.html?v=' + globalgsvapp,
            controller: 'JobCntrl'
        });
    }

})();