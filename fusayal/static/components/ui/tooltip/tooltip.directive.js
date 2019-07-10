/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("tooltip", tooltip);

    function tooltip(){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                var opciones = scope.$eval(attrs.tooltip);
                var defaultops = {placement:'top',title:'definir'};
                for (var op in opciones){
                    defaultops[op]= opciones[op];
                }
                $(element).tooltip(defaultops);
                $(element).hover(function(){
                    $(element).tooltip('show');
                }, function(){
                    $(element).tooltip('hide');
                });
                $(element).click(function(){
                    $(element).tooltip('hide');
                });
            }
        }
    }
})();