/**
 * Created by Manuel on 11/03/2015.
 */
(function(module){
    'use strict';
    module.service("NotifServ", NotifServ);

    function NotifServ(){
        this.info = function(message){
            toastr.info(message);
        }
        this.success = function(message){
            toastr.success(message);
        }
        this.warning = function(message){
            toastr.warning(message);
        }
        this.error = function(message){
            toastr.error(message);
        }
        this.erroroptions = function(message,title,options){
            toastr.error(message,title,options);
        }
        this.warningoptions = function(message,title,options){
            toastr.warning(message,title,options);
        }
        this.infooptions = function(message,title,options){
            toastr.info(message,title,options);
        }
        this.successoptions = function(message,title,options){
            toastr.success(message,title,options);
        }
    }
})(IsyplusApp);