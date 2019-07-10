/**
 * Created by serviestudios on 26/01/16.
 */
(function () {
    'use strict';
    angular
        .module("isyplus")
        .factory("converArtService", converArtService);

    function converArtService($resource){
        return $resource("/rest/articulos/conversion/:art_codigo", {art_codigo: "@art_codigo"},{
            getForm:{
                method: 'GET',
                params: {
                    accion: 'form'
                }
            }
        });
    }
})();