(function () {
    'use strict';
    angular
        .module("isyplus")
        .config(configLogin);
    function configLogin($stateProvider){
        $stateProvider.state('login',{
            url : '/login',
            templateUrl: 'static/app/login/login.html?v=' + globalgsvapp,
            controller: 'LoginCntrl'
        });
    }

})();