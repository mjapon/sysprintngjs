/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('startFrom', startFrom);
    function startFrom(){ //devuelve un array nuevo de acuerdo a la variable start -> desde start hasta array.length
        return function(input, start) {
            return input.slice(start);
        }
    }
})();