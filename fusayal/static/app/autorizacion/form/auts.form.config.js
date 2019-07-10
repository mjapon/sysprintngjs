(function () {
    'use strict';
    angular.module("isyplus")
        .config(configAutsForm);
    function configAutsForm($stateProvider) {
        $stateProvider.state("auts_form",{
            url:'/autorizacion/form',
            templateUrl: 'static/app/autorizacion/form/autorizacion.form.html?v=' + globalgsvapp,
            controller: 'AutorizacionFormCntrl'
        });
    }

})();