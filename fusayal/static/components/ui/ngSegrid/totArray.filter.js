/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter("totArrayFilter", totArrayFilter);

    function totArrayFilter(){
        return function(data, key) {
            try{
                if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
                    return 0;
                }

                var sum = 0;
                for (var i = data.length - 1; i >= 0; i--) {
                    sum += parseFloat(data[i][key]);
                }

                return sum;
            }
            catch(e){
                return 0;
            }
        }
    }

})();