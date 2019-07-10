(function () {
    'use strict';
    angular.module("isyplus")
        .config(configContribs);

    function configContribs($stateProvider){
        $stateProvider.state('contribs_list',{
            url : '/contribuyentes',
            templateUrl: 'static/app/contribuyente/contribuyente.list.html?v=' + globalgsvapp,
            controller: 'ContribCntrl'
        });
    }

})();