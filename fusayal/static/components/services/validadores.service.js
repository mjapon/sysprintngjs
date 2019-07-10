/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.service("ValidadoresServ", ValidadoresServ);

    function ValidadoresServ(){
        this.es_decimal = function($scope, valor){
            var cadena = $scope[valor];
            var entero, lastdato, puntodec, i, j;
            for(i=cadena.length-1; i>=0; i--){
                puntodec=0;
                lastdato=cadena.charAt(i);
                entero=parseInt(lastdato);
                for(j=0; j<cadena.length; j++)
                    if (cadena.charAt(j) == '.')
                        puntodec++;
                if (isNaN(entero) && lastdato != '.' && lastdato != '-')
                    cadena = cadena.substring(0, cadena.length - 1);
                if (lastdato == '.' && puntodec > 1)
                    cadena = cadena.substring(0, cadena.length - 1);
                if (lastdato == '-' && i != 0)
                    cadena = cadena.substring(0, cadena.length - 1);
            }
            $scope[valor] = cadena;
        };

        this.es_entero = function($scope, valor){
            var cadena = $scope[valor];
            var entero, lastdato, puntodec, i, j;
            for(i=cadena.length-1; i>=0; i--){
                puntodec=0;
                lastdato=cadena.charAt(i);
                entero=parseInt(lastdato);
                for(j=0; j<cadena.length; j++)
                    if (cadena.charAt(j) == '.')
                        puntodec++;
                if (isNaN(entero) && lastdato != '.' && lastdato != '-')
                    cadena = cadena.substring(0, cadena.length - 1);
                if (lastdato == '.' && puntodec > 0)
                    cadena = cadena.substring(0, cadena.length - 1);
                if (lastdato == '-' && i != 0)
                    cadena = cadena.substring(0, cadena.length - 1);
            }
            $scope[valor] = cadena;
        };
    }
})(IsyplusApp);