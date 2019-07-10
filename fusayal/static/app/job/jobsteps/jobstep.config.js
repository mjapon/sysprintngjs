(function () {
    'use strict';
    angular.module("isyplus")
      .config(jobConfig);
    function jobConfig($stateProvider) {
        $stateProvider.state('job_step',{
            url : '/jobsteps',
            templateUrl: 'static/app/job/jobsteps/jobsteps.html?v=' + globalgsvapp,
            controller: 'JobStepsCntrl'
        });
    }


})();