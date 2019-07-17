/**
 * Created by serviestudios on 05/02/16.
 */
(function (module) {
    'use strict';
    module.factory("GeneralSrv", GeneralSrv);

    function GeneralSrv($sessionStorageSrv, $http, $timeout, $compile) {

        return {
            almdescri: almdescri,
            cambiarEstadoLista: cambiarEstadoLista,
            clearSSValue: clearSSValue,
            confirma: confirma,
            copyValues: copyValues,
            esCedulaValida: esCedulaValida,
            esCiRucValido: esCiRucValido,
            esFechaMenor: esFechaMenor,
            esFechaValida: esFechaValida,
            esRucValido: esRucValido,
            exportaArchivo: exportaArchivo,
            get_appconfig: get_appconfig,
            getClaNombre: getClaNombre,
            getCodigos: getCodigos,
            getEmprel: getEmprel,
            getEsquemaActual: getEsquemaActual,
            getImpuestos: getImpuestos,
            getnParcialView: getnParcialView,
            getNumUser: getNumUser,
            getProyectoSesion: getProyectoSesion,
            getRutaRegresa: getRutaRegresa,
            getSSValue: getSSValue,
            getTclave: getTclave,
            getValidCedRuc: getValidCedRuc,
            is_null: is_null,
            is_undefined: is_undefined,
            isNullOrUndef: isNullOrUndef,
            isScopeInSS: isScopeInSS,
            isObjVacio: isObjVacio,
            loadSSToScope: loadSSToScope,
            saveScopeToSS: saveScopeToSS,
            setFocus: setFocus,
            setFocusWithTimeout: setFocusWithTimeout,
            setRutaRegresa: setRutaRegresa,
            setSSValue: setSSValue,
            getIPServer: getIpServer
        };

        function getNumUser() {
            return $http.get('/rest/tusuarios/0?opc=numuser');
        }

        function getClaNombre(numus) {
            return $http.get('/rest/tusuarios/' + numus + '?opc=clanom');
        }

        function getRutaRegresa() {
            return $sessionStorageSrv.getObject('rutaRegresa', null);
        }

        function setRutaRegresa(ruta) {
            $sessionStorageSrv.setObject('rutaRegresa', ruta);
        }

        function getCodigos(form) {
            $http.get('/rest/general/0?opc=obtcod').then(function (rpta) {
                if (rpta.data.estado === 1) {
                    form.empresa = rpta.data.codemp;
                    form.almacen = rpta.data.almcod;
                    form.esquema = rpta.data.esquema;
                    form.usuario = rpta.data.usuario;
                    form.seccion = rpta.data.seccion;
                }
            });
        }

        function getImpuestos(func) {
            return $http.get('/rest/transacc/timpuestos').then(func);
        }

        function exportaArchivo(nombreServlet, params, formato) {
            var isnginx = parseInt(globalModoDespligeApp) == 2;
            var url = '/reportes/repjasper/' + nombreServlet + '?formato=' + formato + "&" + $.param(params);
            if (!isnginx) {
                url = 'http://localhost:8080/repjasper/' + nombreServlet + '?formato=' + formato + "&" + $.param(params);
            }
            window.open(url);//edit
        }

        /**
         * @deprecated No usar, usar FechasServ
         * @param fecha
         * @returns {*|boolean}
         */
        function esFechaValida(fecha) { // válido solo para fechas de formato DD/MM/YYYY
            var fechaval = moment(fecha, 'DD/MM/YYYY', true).isValid();
            var anioval = moment(fecha, 'DD/MM/YYYY', true).year() > 2000;
            return fechaval && anioval;
        }

        /**
         * @deprecated No usar, usar FechasServ
         * @param fecini
         * @param fecfin
         * @returns {*}
         */
        function esFechaMenor(fecini, fecfin) {
            var desde = moment(fecini, 'DD/MM/YYYY');
            var hasta = moment(fecfin, 'DD/MM/YYYY');
            return moment(desde).isBefore(hasta);
        }

        function esCedulaValida(cedula) {
            var total = 0;
            var lenCedula = 10;
            var coeficientes = "212121212";
            var numProviciaas = 24;
            var maxValDigitTres = 5; //el tercer digito debe ser menor o igual a 5
            var esCedulaValida = false;
            if (cedula.length == lenCedula) {
                var provincia = parseInt(cedula.substring(0, 2), 10);
                var digitoTres = parseInt(cedula[2], 10);
                var digitoVerif = parseInt(cedula[9], 10);
                if (provincia > 0 && provincia <= numProviciaas && digitoTres <= maxValDigitTres) {
                    for (var i = 0; i < coeficientes.length; i++) {
                        var valor = parseInt(coeficientes[i], 10) * parseInt(cedula[i], 10);
                        total = total + (valor > 9 ? (valor - 9) : valor);
                    }
                    var restoMod10 = total % 10;
                    if (restoMod10 === 0) {
                        esCedulaValida = digitoVerif === 0;
                    }
                    else {
                        esCedulaValida = digitoVerif === (10 - restoMod10);
                    }
                }
            }
            return esCedulaValida;
        }

        function esRucValido(ruc) {
            var lenruc = 13;
            var numProvicias = 24;
            var maxValDigitTres = 5; //el tercer digito debe ser menor o igual a 5
            var total = 0;
            var esRucValido = false;
            if (ruc.length == lenruc) {
                //Verificar si es ruc de persona natural:
                var provincia = parseInt(ruc.substring(0, 2), 10);
                var digitoTres = parseInt(ruc[2], 10);
                var ulttresdigitos = ruc.substring(10, 13);

                if ((ulttresdigitos === "001" || ulttresdigitos === "002" || ulttresdigitos === "003") && (provincia > 0 && provincia <= numProvicias)) {
                    if (digitoTres <= maxValDigitTres) {//ruc persona natural
                        esRucValido = this.esCedulaValida(ruc.substring(0, 10));
                    }
                    else if (digitoTres == 6) {//ruc publico
                        var coeficientes = "32765432";
                        var digitoVerif = parseInt(ruc[8], 10);
                        total = 0;
                        for (var i = 0; i < coeficientes.length; i++) {
                            var valor = parseInt(coeficientes[i], 10) * parseInt(ruc[i], 10);
                            total = total + valor;
                        }
                        var restoMod11 = total % 11;
                        if (restoMod11 === 0) {
                            esRucValido = digitoVerif === 0;
                        }
                        else {
                            esRucValido = digitoVerif === (11 - restoMod11);
                        }
                    }
                    else if (digitoTres == 9) {//ruc juridico o extranjero
                        var coeficientes = "432765432";
                        var digitoVerif = parseInt(ruc[9], 10);
                        total = 0;
                        for (var i = 0; i < coeficientes.length; i++) {
                            var valor = parseInt(coeficientes[i], 10) * parseInt(ruc[i], 10);
                            total = total + valor;
                        }
                        var restoMod11 = total % 11;
                        if (restoMod11 === 0) {
                            esRucValido = digitoVerif === 0;
                        }
                        else {
                            esRucValido = digitoVerif === (11 - restoMod11);
                        }
                    }
                }
            }
            return esRucValido;
        }

        function esCiRucValido(ciruc) {
            var escirucvalido = false;
            if (ciruc.length === 10) {
                escirucvalido = this.esCedulaValida(ciruc);
            }
            else if (ciruc.length === 13) {
                escirucvalido = this.esRucValido(ciruc);
            }
            return escirucvalido;
        }

        function getValidCedRuc(cedruc) {
            return $http.get('/rest/general/0?cedruc=' + cedruc + '&opc=validcedruc');
        }

        function setSSValue(key, value) {
            $sessionStorageSrv.setObject(key, value);
        }

        function getSSValue(key) {
            return $sessionStorageSrv.getObject(key, null);
        }

        function clearSSValue(key) {
            $sessionStorageSrv.delete(key);
        }

        /**
         * Verifica si el scope esta en session storage, dada la clave en sesion storage
         * @param key
         * @returns {boolean}
         */
        function isScopeInSS(key){
            var res = getSSValue(key);
            if (res){
                return true;
            }
            else{
                return false;
            }
        }


        /**
         * Graba el $scope en sessionStorage del navegador usando la clave key,
         * Util cuando se requiere navegacion entre pantallas
         * @param $scope
         * @param key
         */
        function saveScopeToSS($scope, key) {
            var scopeobject = {};
            for (var prop in $scope) {
                if (prop.indexOf("$") === 0) {
                    //console.log("no se toma en cuenta la propiedad:"+prop);
                }
                else {
                    var tipo = typeof  $scope[prop];
                    if ((tipo !== "function")) {
                        scopeobject[prop] = $scope[prop];
                    }
                }
            }
            this.setSSValue(key, scopeobject);
        }

        /**
         * Carga en el scope, el objeto registrado en sessionstorage con la key especificada
         * @param $scope, el scope donde se cargara el objeto de ss
         * @param key, la clave con que se registro el objeto en ss
         */
        function loadSSToScope($scope, key){

            var cacheData = getSSValue(key);
            if (cacheData){
                for(var prop in cacheData){
                    $scope[prop] = cacheData[prop];
                }
                clearSSValue(key);
                return true;
            }
            else{
                alert("NO HAY DATOS EN SS DEL FORM clave "+key);
            }

            return false;
        }


        /**
         * Itera por las propiedades del objeto from y los sobreescribe en el objeto to
         * @param from
         * @param to
         */
        function copyValues(from, to) {
            for (var prop in from) {
                to[prop] = from[prop];
            }
        }

        /**
         * @deprecated No usar, usar focusService
         * @param elementid
         */
        function setFocus(elementid) {
            $("#" + elementid).focus();
        }

        /**
         * @deprecated No usar, usar focusService
         * @param elementid
         * @param timeinms
         */
        function setFocusWithTimeout(elementid, timeinms) {
            $timeout(function () {
                setFocus(elementid);
            }, timeinms);
        }

        function confirma(msg, accion, $scope, tipo) {
            $('#msgConfirm').html(msg);
            $('#btnAceptConfir').replaceWith($('#btnAceptConfir'));
            $('#btnAceptConfir').attr('ng-click', accion + "('" + tipo + "');");
            $compile($('#btnAceptConfir'))($scope);
            $('#msgModalConfirm').modal('show');
        }

        function cambiarEstadoLista(estado, lista, propiedad) {
            var e, op;
            for (e in lista) {
                op = lista[e];
                op[propiedad] = estado == true ? 1 : 0;
            }
        }

        function isObjVacio(obj) {
            return Object.keys(obj).length === 0;
        }

        /**
         * Verifica si un objeto es null o undefined
         * @param obj
         * @returns {boolean}
         */
        function isNullOrUndef(obj) {
            if (!this.is_undefined(obj)) {
                return obj === null;
            }
            return true;
        }

        function is_null(obj) {//Verifica si un objeto es null o undefined
            if (!this.is_undefined(obj)) {
                return obj === null;
            }
            return false;
        }

        function is_undefined(obj) {
            return (typeof obj) === "undefined";
        }

        function get_appconfig() {
            var url = getUrlRestGen("appconfig");
            return $http.get(url);
        }

        function getProyectoSesion() {
            var url = getUrlRestGen("pry_codigo");
            return $http.get(url);
        }

        function getEmprel() {
            return $http.get('/rest/general?opc=emprel');
        }

        function getEsquemaActual() {
            var url = getUrlRestGen("esquema");
            return $http.get(url);
        }

        function almdescri() {
            var url = getUrlRestGen("almdescri");
            return $http.get(url);
        }

        function getnParcialView() {
            var url = getUrlRestGen("nparcialview");
            return $http.get(url);
        }

        function getTclave() {
            var url = getUrlRestGen("tclave");
            return $http.get(url);
        }

        function getUrlRestGen(opcion){
            return "/rest/general/0?opc="+opcion;
        }

        function getIpServer() {
            return "157.230.129.131";
            //return "localhost";
        }

    }
})(IsyplusApp);