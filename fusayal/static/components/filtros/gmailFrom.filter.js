/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('gmailFromFilter', gmailFromFilter);

    function gmailFromFilter(){
        return function(from){
            if (from){
                return from.replace(/<.+@.+>/,"");
            }
            else{
                return from;
            }
        }
    }

})();