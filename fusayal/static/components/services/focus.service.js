/**
 * Created by serviestudios on 22/01/16.
 */
(function (module) {
    'use strict';
    module.factory("focusService", focusService);

    function focusService($timeout){

        var service = {
            setFocus: setFocus,
            setFocusTimeout: setFocusTimeout
        };

        return service;

        /**
         * Establece el foco en un elemento dado suy id, si se pasa timeout, se establece el foco
         * despues del timeout indicado
         * @param inputid (required)
         * @param timeout (optional)
         */
        function setFocus(elementid, timeout){
            if (angular.isUndefined(timeout)){
                if (elementid){
                    $("#"+elementid).focus();
                }
            }
            else{
                setFocusTimeout(elementid, timeout);
            }
        }

        /**
         * Establece el foco en un elemento, pasado un cierto tiempo(timeout)
         * @param elementid
         * @param timeout
         */
        function setFocusTimeout(elementid, timeout){
            $timeout(function(){
                setFocus(elementid);
            }, timeout||300);
        }
    }

})(IsyplusApp);