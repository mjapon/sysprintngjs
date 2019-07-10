/**
 * Created by serviestudios on 02/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("serviFocusSelect", serviFocusSelect);

    /**
     * Selecciona todo el texto de un campo cuando este obtiene el foco
     * @returns {{restrict: string, link: Function}}
     */
    function serviFocusSelect(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                 element.focus(function() {
                     try{
                         $(this).select();
                     }
                     catch(ex){
                         console.log("Error en focus event select", ex);
                     }
                 } );
            }
        }
    }

})();