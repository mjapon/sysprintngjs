(function () {
    'use strict';
    angular.module("isyplus")
        .config(configForm);

    function configForm($stateProvider){

         $stateProvider.state('usuarios_form',{
            url : '/usuarios/:userid/:accion',
            templateUrl: 'static/app/usuarios/form/users.form.html?v=' + globalgsvapp,
            controller: 'UserFormCntrl'
        });

    }


})();