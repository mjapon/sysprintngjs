/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.service("$localStorageSrv", localStorageSrv);

    function localStorageSrv($window) {
        this.set = function(key, value) {
            $window.localStorage[key] = value;
        };

        this.get = function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        };

        this.setObject = function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        };

        this.getObject = function(key, defaultValue) {
            if ($window.localStorage[key]){
                return JSON.parse($window.localStorage[key]);
            } else {
                return defaultValue;
            }
        };

        this.delete = function(key){
            delete $window.localStorage[key];
        };
    }
})(IsyplusApp);