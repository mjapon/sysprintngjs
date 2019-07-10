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