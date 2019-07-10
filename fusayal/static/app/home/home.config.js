/**
 * Created by serviestudios on 04/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .config(configLibroMayor);
    function configLibroMayor($stateProvider){
        $stateProvider.state('home', {
            url : '/home/',
            templateUrl: 'static/app/home/home.html?v=' + globalgsvapp,
            controller: 'HomeCntrl'
        });
    }
})();