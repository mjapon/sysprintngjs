(function () {
    'use strict';
    angular.module("isyplus")
        .factory("AuditService", AuditService);

    function AuditService($resource) {
        return $resource("/rest/audit/:aud_id",
            {aud_id: '@aud_id'}, {

            }
        );
    }


})();