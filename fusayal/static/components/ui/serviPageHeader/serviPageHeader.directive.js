/**
 * Created by serviestudios on 15/01/16.
 */
(function(){
    'use strict';
    angular
        .module("isyplus")
        .directive("serviPageHeader", serviPageHeader);

    function serviPageHeader(){

        var directive = {
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: 'static/components/ui/serviPageHeader/serviPageHeader.html?v='+ globalgsvapp
        }

        return directive;
    }

})();