/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('ifNumberFormat', ifNumberFormat);

    function ifNumberFormat(){
        return function(val, fractions){
            if ( typeof val == 'number' ){
                try{
                    return val.toFixed( fractions );
                }
                catch(e){}
            }
            return val;
        }
    }
})();