(function () {
    'use strict';
    angular.module("isyplus")
    .factory("EmpresaServ", EmpresaServ);

    function EmpresaServ($resource){
        return $resource("/rest/tempresa/:emp_id", {emp_id:'@emp_id'}, {

        });

    }

})();