(function () {
    'use strict';
    angular.module("isyplus")
    .config(jobUpConfig);
    function jobUpConfig($stateProvider) {
        $stateProvider.state('job_upload',{
            url : '/jobupload',
            templateUrl: 'static/app/job/jobuploaddoc/jobjup.html?v=' + globalgsvapp,
            controller: 'JobUpCntrl'
        });
    }


})();