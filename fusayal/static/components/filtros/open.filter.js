/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('openFilter', openFilter);

    function openFilter(){
        return function(prop) {
            if (prop === 0) {
                return 'ABIERTO';
            } else if (prop === 1) {
                return 'CERRADO';
            } else if (prop === 2) {
                return 'BLOQUEADO';
            }
        };
    }

})();