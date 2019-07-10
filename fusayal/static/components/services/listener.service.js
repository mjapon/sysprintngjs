/**
 * Created by Manuel on 11/03/2015.
 */
(function(module) {
    'use strict';
    module.service("ListenerServ", ListenerServ);

    function ListenerServ($document){
        this.F1 = 112;
        this.F2 = 113;
        this.F3 = 114;
        this.F4 = 115;
        this.F5 = 116;
        this.F6 = 117;
        this.F7 = 118;
        this.F8 = 119;
        this.F9 = 120;
        this.F10 = 121;
        this.F11 = 122;
        this.F12 = 123;
        this.ESC = 27;
        this.RETROCESO = 8;
        this.TAB = 9;
        this.ENTER = 13;
        this.MAYUS = 16;
        this.CONTROL = 17;
        this.BARRA_ESPACIADORA = 32;
        this.REPAG = 33;
        this.AVPAG = 34;
        this.INICIO = 36;
        this.FIN=35;
        this.FLECHA_IZQ=37;
        this.FLECHA_DER=39;
        this.FLECHA_ARRIBA=38;
        this.FLECHA_ABAJO=40;

        this.is_procesando = function($scope){
            return $scope['procesando_key'] || false;
        }

        this.add_keydown_listener = function(keycode, $scope, fn){
            var self = this;
            $document.on("keydown", function(e){
                if(e.which == keycode) {
                    e.preventDefault();
                    if (self.is_procesando($scope)===true){
                        alert("!!!YA SE ESTA PROCESANDO ESPERE UN MOMENTO!!!");
                    }
                    else{
                        fn($scope);
                    }
                }
            });
        }

        this.remove_keydown_listener = function(){
            $document.off("keydown");
        }

        this.add_state_keydown_event = function($scope, keycode, fn){
            var self = this;
            $scope.$on("$stateChangeSuccess", function(ev, toState, toParams, fromState, fromParams){
                self.add_keydown_listener(keycode, $scope, fn);
            })
        }

        this.remove_state_keydown_event = function($scope){
            $scope.$on("$stateChangeStart", function(ev, toState, toParam, fromState, fromParams){
                //console.log(" documento of keydow------------------->");
                $document.off("keydown");
            });
        }

        this.add_action_on_state_change_start = function($scope, fn){
            $scope.$on("$stateChangeStart", function(ev, toState, toParam, fromState, fromParams){
                fn();
            });
        }
    }

})(IsyplusApp);