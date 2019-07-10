(function () {
    'use strict';
    angular.module("isyplus")
        .config(configContribForm);

    function configContribForm($stateProvider){
        $stateProvider.state('contribs_form',{
            url : '/contribuyentes/form/:cnt_id',
            templateUrl: 'static/app/contribuyente/form/contribs.form.html?v=' + globalgsvapp,
            controller: 'ContribFormCntrl'
        });
    }

})();