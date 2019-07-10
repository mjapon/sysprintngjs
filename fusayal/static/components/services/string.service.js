/**
 * Created by serviestudios on 23/02/16.
 */
(function (module) {
    'use strict';
    module.factory("StringServ", StringServ);

    function StringServ(){

        return {
            limpiaEspacios: limpiaEspacios,
            limpiaRegEx: limpiaRegEx,
            soloNumLetras: soloNumLetras,
            trim: trim,
            noNuloNoVacio: noNuloNoVacio
        };

        /**
         * Quita de una cadena todos los espacios en blanco
         * @param strng
         * @returns {string}
         */
        function limpiaEspacios(string){
            return (string||'').replace(/ /g,'');
        }

        /**
         * Quita espacios al inicio y al final de una cadena
         * @param string
         * @returns {string}
         */
        function trim(string){
            return (string||'').trim();
        }

        /**
         * Quita todas las coincidencias de la expresion regular
         * @param regexp
         * @returns {string}
         */
        function limpiaRegEx(string, regexp){
            return (string||'').replace(regexp,'');
        }

        /**
         * Quita todos los caracteres especiales de una cadena (deja solo numeros y letras)
         * @param string
         * @returns {string}
         */
        function soloNumLetras(string){
            return limpiaRegEx(string, /[^0-9a-zA-Z]/gi);
        }

        /**
         * Verifica que una cadena sea distinta de null y de espacios en blanca, que una cadena tenga algo ingresado
         * @param cadena
         * @returns {boolean}
         */
        function noNuloNoVacio(cadena){
            return cadena!==undefined && cadena!==null && cadena.trim().length>0;
        }

    }

})(IsyplusApp);