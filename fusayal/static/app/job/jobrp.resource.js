(function () {
    'use strict';
    angular.module("isyplus")
        .factory("JobRPService", JobRPService);

    function JobRPService($resource) {
        return $resource("/rest/jobrp/:jobrp_id",
            {jobrp_id: '@jobrp_id'}, {
            
            }
        );
    }


})();