(function () {
    'use strict';
    angular.module("isyplus")
    .config(jobViewConfig);
    function jobViewConfig($stateProvider) {
        $stateProvider.state('job_view',{
            url : '/jobview/:job_id',
            templateUrl: 'static/app/job/jobview/job.view.html?v=' + globalgsvapp,
            controller: 'JobViewCntrl'
        });
    }


})();