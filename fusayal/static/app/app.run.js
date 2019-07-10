/**
 * Created by serviestudios on 28/01/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .run(onIsyplusRun);

    function onIsyplusRun($rootScope, ajaxAnimService, sideBarService){
        $rootScope.$on('loading:progress', function(){
            ajaxAnimService.show(true);
        });
        $rootScope.$on('loading:finish', function(){
            ajaxAnimService.show(false);
        });

        $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
            try{
                scrollView($("#app_bar"));
            }
            catch(e){}
        });

        function scrollView(self){
            return self.each(function () {
                $('html, body').animate({
                  scrollTop: $(self).offset().top
                }, 900);
              });
        }

        //sideBarService.setup();
    }
})();