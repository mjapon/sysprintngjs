/**
 * Created by Manuel on 11/03/2015.
 */
(function (module) {
    'use strict';
    module.factory("ListasServ", ListasServ);

    function ListasServ($filter) {

        return {
            filtrar: filtrar,
            getValoresColumna: getValoresColumna,
            limpiarMarcados: limpiarMarcados,
            getIndexOf: getIndexOf,
            removeItem: removeItem,
            buscarObjeto: buscarObjeto,
            sumarColumna: sumarColumna,
            limpiaMarca: limpiaMarca,
            getMarcados: getMarcados,
            getFirstMarcado: getFirstMarcado
        };

        /**
         * Aplica filtro de angular $filter, a un arrego, dado la expresion Ejm: {marcados:true}
         * @param array
         * @param expression
         * @returns {*}
         */
        function filtrar(array, expression) {
            return $filter('filter')(array, expression);
        }

        /**
         * //Busca en el arreglo el valor dada la pripiedad y los registra en un array,el cual es retornado
         * @param array
         * @param propiedad
         * @returns {Array}
         */
        function getValoresColumna(array, propiedad) {
            var listaData = [];
            $.each(array, function (intValue, currentElement) {
                listaData.push(currentElement[propiedad]);
            });
            return listaData;
        }

        /**
         * Utilidad para marcar como false la propiedad prop a todos los objetos de la lista
         * @param array
         * @param expression
         * @param prop
         */
        function limpiarMarcados(array, expression, prop) {
            var filtrados = this.filtrar(array, expression);
            angular.forEach(filtrados, function (value, key) {
                value[prop] = false;
            });
        }

        function limpiaMarca(array) {
            this.limpiarMarcados(array, {marcado: true}, 'marcado');
        }


        function getMarcados(array) {
            var filtrados = this.filtrar(array, {marcado: true});
            return filtrados;
        }

        function getFirstMarcado(array) {
            var filtrados = this.filtrar(array, {marcado: true});
            if (filtrados && filtrados.length > 0) {
                return filtrados[0];
            }
            return null;
        }

        function getIndexOf(array, item) {
            return array.indexOf(item);
        }

        /**
         * Eliminar un objeto de una lista, si el objeto pertenece a la lista
         * @param array
         * @param item
         */
        function removeItem(array, item) {
            var indexofitem = array.indexOf(item);
            if (indexofitem != -1) {
                array.splice(indexofitem, 1);
            }
        }

        /**
         * Busca un objeto en el arreglo dado la propiedad y el valor de la propiedad
         * @param array
         * @param propiedad
         * @param valor
         * @returns {*}
         */
        function buscarObjeto(array, propiedad, valor) {
            var obj_target;
            $.each(array, function (intValue, currentElement) {
                if (currentElement[propiedad] == valor) {
                    obj_target = currentElement;
                    return false;
                }
            });
            return obj_target;
        }

        /**
         * Itera por el array sumando la propiedad del objeto y retorna este valor
         * @param array
         * @param col
         * @returns {number}
         */
        function sumarColumna(array, col) {
            var total = 0.0;
            angular.forEach(array, function (value, key) {
                total += Number(value[col]);
            });
            return total;
        }
    }

})(IsyplusApp);