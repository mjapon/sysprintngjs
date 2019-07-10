(function () {
    'use strict';
    angular.module("isyplus")
        .factory("ContribuyenteServ", ContribuyenteServ);

    function ContribuyenteServ($resource) {
        return $resource("/rest/contribuyente/:cnt_id",
            {cnt_id: '@cnt_id'}, {

                getForm: {
                    method: 'GET',
                    params: {
                        accion: 'form'
                    }
                },

                findByRuc:{
                    method: 'GET',
                    params : {
                        accion: 'find'
                    }
                }

            });
    }

})();