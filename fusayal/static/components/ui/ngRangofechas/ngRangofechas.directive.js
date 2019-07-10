/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngRangofechas", ngRangofechas);

    function ngRangofechas(){
        return {
            restrict: 'E',
            scope:{
                form:"=",
                setup:"=",
                disabled:"="
            },
            controller: "NgRangoFechasCntrl",
            templateUrl:"static/components/ui/ngRangofechas/ngRangofechas.html?v=" + globalgsvapp
        }
    }

})();