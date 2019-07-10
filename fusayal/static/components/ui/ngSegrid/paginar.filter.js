/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .filter('paginarFiltro', paginarFiltro);
    function paginarFiltro(){
        return function(items, pag, nfilas){
            if (!items){
                return items;
            }
            //pag debe iniciar en cero
            return items.slice(parseInt(pag * nfilas), parseInt((pag + 1) * nfilas + 1) - 1);
        }
    }
})();