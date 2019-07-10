/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('hasValueFilter', hasValueFilter);

    function hasValueFilter(){
        return function(prop) {
            return prop === 0 ? 'NO' : 'SI';
        };
    }

})();