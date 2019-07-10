(function () {
    'use strict';
    angular.module("isyplus")
     .factory("ReportesServ", ReportesServ);

    function ReportesServ($resource) {

        return $resource("/rest/plantillas/:temp_id", {temp_id:'@temp_id'}, {


        });
    }

})();