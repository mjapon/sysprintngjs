/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("propiedadesAdcDir", propiedadesAdcDir);


    function propiedadesAdcDir(){
        return {
            restrict: 'EA',
            replace: false,
            scope:{
                categorias:"=",
                classpanel:"=",
                fnvisible:"=",
                fndisabled: "=",
                fnchange: "="
            },

            controller: function(){


            },
            templateUrl:"static/components/camposadc/propiedadesAdcDir/propiedadesAdcDir.html?v=" + globalgsvapp
        }
    }

})();