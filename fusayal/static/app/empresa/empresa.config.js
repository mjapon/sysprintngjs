(function () {
    'use strict';
    angular.module("isyplus")
        .config(config);
    function config($stateProvider){
        $stateProvider.state('empresa', {
            url : '/empresa/',
            templateUrl: 'static/app/empresa/empresa.html?v=' + globalgsvapp,
            controller: 'EmpresaCntrl'
        });
    }


})();