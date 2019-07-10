(function () {
    'use strict';
    angular.module("isyplus")
        .config(configJobForm);
    function configJobForm($stateProvider) {
        $stateProvider.state('job_form',{
            url:'/job/form/:job_id',
            templateUrl: 'static/app/job/form/job.form.html?v=' + globalgsvapp,
            controller: 'JobFormCntrl'
        });
    }

})();