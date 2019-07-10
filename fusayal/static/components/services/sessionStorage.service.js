/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.factory("$sessionStorageSrv", sessionStorageSrv);

    /**
     * Gestiona el objeto sessionStorage de la session del navegador
     * @param $window
     * @returns {{set: set, get: get, setObject: setObject, getObject: getObject, delete: borrar, clear: clear}}
     */
    function sessionStorageSrv($window) {
        return {
            set: set,
            get: get,
            setObject: setObject,
            getObject: getObject,
            delete: borrar,
            clear: clear
        };

        function set(key, value) {
            $window.sessionStorage[key] = value;
        }

        function get(key, defaultValue) {
            return $window.sessionStorage[key] || defaultValue;
        }

        function setObject(key, value) {
            $window.sessionStorage[key] = JSON.stringify(value);
        }

        function getObject(key, defaultValue) {
            if ($window.sessionStorage[key]) {
                return JSON.parse($window.sessionStorage[key]);
            } else {
                return defaultValue;
            }
        }

        function borrar(key) {
            delete $window.sessionStorage[key];
        }

        function clear() {
            $window.sessionStorage.clear();
        }
    }
})(IsyplusApp);