(function () {
    'use strict';
    angular.module("isyplus")
     .factory("RolesServ", RolesServ);
    
    function RolesServ($resource) {

        return $resource("/rest/userroles/:us_id", {us_id:'@us_id'}, {

             getRolesUser:{
                method: 'GET',
                params:{
                    accion:'getrolesu'//, editado
                }
            }
        });
    }

})();