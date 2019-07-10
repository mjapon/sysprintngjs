(function () {
    'use strict';
    angular
        .module("isyplus")
        .config(configLogin);
    function configLogin($stateProvider){
        $stateProvider.state('usuarios',{
            url : '/usuarios',
            templateUrl: 'static/app/usuarios/usuarios.html?v=' + globalgsvapp,
            controller: 'UsuariosCntrl'
        });
    }

})();