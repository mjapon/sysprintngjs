/**
 * Created by serviestudios on 20/01/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("serviPane", serviPane);

    function serviPane(){
        var directive = {
            restrict: 'EA',
            replace: true,
            templateUrl: 'static/components/ui/serviPanel/serviPanel.html?v='+ globalgsvapp,
            transclude:{
                "titleSlot":"?paneTitle",//La vista que use esta directiva debe crear <pane-title> </pane-title> para el titulo
                "bodySlot":"?paneBody"//La vista que use esta directiva debe crear <pane-body> </pane-body> que ira al body del panel
            },
            scope:true,
            bindToController: {
                type: "@",
                showHeader: "@",
                showBody: "@"
            },
            controller: function(){
                //Si no ha sido especificaco showHeader, showBody, se define por defecto que si se muestren
                if (angular.isUndefined(this.showHeader)){
                    this.showHeader="true";
                }
                if (angular.isUndefined(this.showBody)){
                    this.showBody="true";
                }
            },
            controllerAs: "cntrl"
        }
        return directive;
    }
})();