/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngSegrid", ngSegrid);

    function ngSegrid(){
        return {
            restrict: 'A',
            scope:{
                cols:'=',
                datos:'=',
                titulo:'@',
                filas:'=',
                colinfo:'='
            },
            controller: "NgSegridCntrl",
            templateUrl: "static/components/ui/ngSegrid/ngSegridtemplate.html?v=" + globalgsvapp,
            link: function(scope, element, attrs){

            }
        }
    }
})();