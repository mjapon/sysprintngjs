/**
 * Created by serviestudios on 28/01/16.
 */
(function (module) {
    'use strict';
    module.factory("ajaxAnimService", ajaxAnimService);
    function ajaxAnimService(){

        var service = {
            show: function(isShow){
                if (isShow){
                    $("#ajax_anim_fondo").height( $( document ).height() );
                    center($('#ajax_anim'));
                    $("#ajax_anim_fondo").css("visibility","visible");
                    $("#ajax_anim").css("visibility","visible");
                }
                else{
                    $("#ajax_anim_fondo").css("visibility","hidden");
                    $("#ajax_anim").css("visibility","hidden");
                }
            }
        }

        return service;
        function center(self){
            self.css("position","absolute");
            self.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
            self.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) +  $(window).scrollLeft()) + "px");
            return self;
        }
    }
})(IsyplusApp);