/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("ngEnter", ngEnter);

    function ngEnter() {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                elem.on('keydown', function(event){
                    if(event.which === 13) {
                        scope.$apply(function (){
                            scope.$eval(attrs.ngEnter);
                        });
                        event.preventDefault();
                    }
                });
            }
        }
    }

})();