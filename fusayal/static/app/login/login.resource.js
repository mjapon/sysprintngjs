(function () {
    'use strict';
    angular.module("isyplus")
        .factory("LoginServ", LoginServ);

    function LoginServ($resource){
        return $resource("/rest/usuarios/:us_id", {us_id:'@us_id'}, {
            chkStatus:{
                method: 'GET',
                params:{
                    accion:'chkstatus'//, editado
                }
            },
            listar:{
                method: 'GET',
                params:{
                    accion:'listar'//, editado
                }
            },
            getForm:{
                method: 'GET',
                params:{
                    accion:'form'
                }
            },
            crearUsuario: {
                method: 'POST',
                params:{
                    accion: 'crear'
                }
            },
            resetClave :{
                method: 'POST',
                params:{
                    accion: 'resetclave'
                }
            },
            cambiarEstado:{
                method: 'POST',
                params:{
                    accion: 'cestado'
                }
            }
        });
    }


})();