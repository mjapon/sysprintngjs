(function () {
    'use strict';
    angular.module("isyplus")
        .factory("JobService", JobService);

    function JobService($resource) {
        return $resource("/rest/job/:job_id",
            {job_id: '@job_id'}, {
                getForm: {
                    method: 'GET',
                    params: {
                        accion: 'form'
                    }
                },

                getJustForm: {
                    method: 'GET',
                    params: {
                        accion: 'justform'
                    }
                },
                getAllInfo: {//Retorna el 3 formularios, del job, del contribuyente y de la autorizacion
                    method: 'GET',
                    params: {
                        accion: 'getall'
                    }
                },


                cambiarEstado: {
                    method: 'POST',
                    params: {
                        accion: 'cambiar_estado'
                    }
                },
                putPlantilla: {
                    method: 'POST',
                    params: {
                        accion: 'put_reporte'
                    }
                }

            });
    }

})();