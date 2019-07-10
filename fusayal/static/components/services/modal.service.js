/**
 * Created by Manuel on 11/03/2015.
 */
(function(module){
    'use strict';
    module.service("ModalServ", ModalServ);

    function ModalServ(){
        this.show = function(modalid){
            $("#"+modalid).modal("show");
        }
        this.hide = function(modalid){
            $("#"+modalid).modal("hide");
        }
        this.onShow = function(modalid, fn){
            $("#"+modalid).on('show.bs.modal', fn);
        }
        this.onShown = function(modalid, fn){
            $("#"+modalid).on('shown.bs.modal', fn);
        }
        this.onHide = function(modalid, fn){
            $("#"+modalid).on('hide.bs.modal', fn);
        }
        this.onHidden = function(modalid, fn){
            $("#"+modalid).on('hidden.bs.modal', fn);
        }
        this.onLoaded = function(modalid, fn){
            $("#"+modalid).on('loaded.bs.modal', fn);
        }
    }
})(IsyplusApp);