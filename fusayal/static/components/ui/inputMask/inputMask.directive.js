/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("inputMask", inputMask);

    function inputMask(){
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, el, attrs){
                $(el).inputmask(scope.$eval(attrs.inputMask));
                el.on('click', function () {
                    this.select();
                });
            }
        }
    }
})();