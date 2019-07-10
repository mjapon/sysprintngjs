/**
 * Created by serviestudios on 28/01/16.
 */
(function (module) {
    'use strict';
    module.factory("sideBarService", sideBarService);

    function sideBarService(){

        return {
            hideAppSideBar: hideAppSideBar,
            showAppSideBar: showAppSideBar,
            setup: setup,
            visible: visible,
            width: getwidth
        };
        function getwidth(){
            return $('#appMenu').width();
        }
        function visible(){
            return $('#appMenu').is(':visible')
        }
        function hideAppSideBar(){
            $("#appMenu").removeClass("col-md-2").addClass("col0");
            $("#appContainer").removeClass("col-md-10").addClass("col-md-12");
            $("#appMenu").hide();
        };

        function showAppSideBar(){
            $("#appMenu").removeClass("col0").addClass("col-md-2");
            $('#appMenu').css('visibility','visible').hide().fadeIn().removeClass('hidden');
            $("#appContainer").removeClass("col-md-12").addClass("col-md-10");
        };

        function setup(){
            $("#appBrand").on("click", function(e){
                if ( $("#appMenu").hasClass('col-md-2') ){
                    hideAppSideBar();
                }
                else{
                    showAppSideBar();
                }
            });

            if ( $("#appBarToggle").is(':visible') ){
                hideAppSideBar();
            }

            $('#sidebar > a').on('mouseover', function (e) {
                $(this).addClass("mymenulihover");
            });

            $('#sidebar > a').on('mouseout', function (e) {
                $(this).removeClass("mymenulihover");
            });

            $('#sidebar > div > a').on('mouseover',function (e) {
                $(this).addClass("mylgihover");
            });

            $('#sidebar > div > a').on('mouseout',function (e) {
                $(this).removeClass("mylgihover");
            });

            $('#sidebar > a').on('click', function (e) {
                var lastActive = $(this).closest("#sidebar").children(".mylgiclick");
                lastActive.removeClass("active");
                lastActive.removeClass("mylgiclick");
                lastActive.next('div').collapse('hide');
                var lastActiveSI = $("#sidebar > div").children(".mylgiclick");
                lastActiveSI.removeClass("mylgiclick");
                $(this).addClass("active");
                $(this).addClass("mylgiclick");
                $(this).next('div').collapse('toggle');
            });

            $('#sidebar > div > a').on('click', function (e) {
                var lastActive = $(this).closest("#sidebar > div").children(".mylgiclick");
                lastActive.removeClass("mylgiclick");
                $(this).addClass("mylgiclick");
                if ( $("#appBarToggle").is(':visible') ){
                    hideAppSideBar();
                }
            });

            $('#appBrand').popover({trigger:'hover'});
        }
    }

})(IsyplusApp);