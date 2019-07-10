/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('estadoFilter', estadoFilter)

    function estadoFilter(){
        return function(prop) {
            return prop === 'T' ? 'ACTIVO' : 'INACTIVO';
        }
    }
})();