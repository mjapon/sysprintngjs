/**
 * Created by serviestudios on 28/01/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .config(configIsyplus);

    function configIsyplus($httpProvider){
        //Se pone interceptor
        $httpProvider.interceptors.push('AnimHttpInterceptor');

        //toaster config
        toastr.options = {"timeOut": "4000","positionClass": "toast-bottom-right"};

        /*
          $provide.decorator('$exceptionHandler', ['$log', '$delegate',
          function($log, $delegate) {
            return function(exception, cause) {
              $log.debug('EEERRRR --->Default exception handler.');
              $delegate(exception, cause);
            };
          }
        ]);
        */

    }

})();