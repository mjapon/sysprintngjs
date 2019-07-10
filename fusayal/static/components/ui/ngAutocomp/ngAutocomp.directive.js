/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular.module("isyplus")
        .directive("ngAutocomp", ngAutocomp);

    function ngAutocomp(){
        return {
            restrict: 'A',
            scope:{
                data:'=',
                model:'=',
                setup:'='
            },
            controller: "NgAutocompCntrl",
            templateUrl:"static/components/ui/ngAutocomp/ngAutocomtemplate.html?v=" + globalgsvapp
        }
    }

})();