/**
 * Created by serviestudios on 20/04/16.
 */
(function (module) {
    'use strict';
    module.controller("ModalRetencionCntrl", ModalRetencionCntrl);

    function ModalRetencionCntrl($scope, $http, $timeout, ListasServ, NumberServ, focusService) {
        var self = this;

        self.tiposRetencion = [];
        self.artsIsLoaded = false;
        self.ttransacc = {};
        self.params = {};
        self.datosFactura = {};
        self.retencionSel = {};
        self.retencionSel.art = {};
        self.indexArtEdit = -1;//Indice de la fila del articul de retencion editado
        self.isEditando = false;
        self.formDetalles = {};
        self.formDetallesInit = {};
        self.formTotales = {};//Totales de la retencion
        self.impuestos = {};
        self.formDatos = {};
        self.formDatosInit = {};
        self.formTotalesInit= {};
        self.rep_printtype = 0;
        self.se_imprime_transacc = 0;
        self.articulos = [];

        self.onRetencionSel = onRetencionSel;
        self.editarRetencion = editarRetencion;
        self.actualizarRetencion = actualizarRetencion;
        self.quitarRetencion = quitarRetencion;
        self.agregarRetencion = agregarRetencion;
        self.setFocus = setFocus;
        self.agregarActualizarRet = agregarActualizarRet;
        self.closeModal = closeModal;

        $scope.$on("add_pagoretencion_event", onShowModalRetencionEvent);

        function init() {
            $http.get("/rest/creatransacc/"+self.params.pro_codigo+"/"+self.params.tra_codigo_ret+"/0?accion=retencion&tra_codigo_from="+self.params.tra_codigo_from).then(function(response){

                if ( response.data['ttransacc'] ) {
                    self.ttransacc = response.data['ttransacc'];
                    self.impuestos = response.data['impuestos'];
                    self.formDatos = response.data['form_datos'];
                    self.formDetalles = response.data['form_detalles'];
                    self.formTotales = response.data['form_totales'];
                    self.rep_printtype = response.data['rep_printtype'];
                    self.se_imprime_transacc = response.data['se_imprime_transacc'];

                    self.formDetallesInit = {};
                    angular.copy(self.formDetalles, self.formDetallesInit);

                    self.formTotalesInit= {};
                    angular.copy(self.formTotales, self.formTotalesInit);

                    if (response.data['articulos_disp']){
                        self.tiposRetencion = response.data['articulos_disp'];
                    }
                    if (response.data['totales_ant']){
                        self.totalesAnt = response.data['totales_ant'];
                    }
                    self.form.isRetencionLoaded = 1;
                }
            });
        }

        function setFocus(elid){
            focusService.setFocus(elid,100);
        }

        function onShowModalRetencionEvent(event, data) {
            self.params = data.params;
            self.datosFactura = data.datosFactura;//Se debe pasar el total y subtotal de la factura de la cual se desea hacer la retencion

            if (data.isRetencionLoaded){
                console.log("Los datos de la retencion ya fueron cargados se muestra modal para edicion de la retencion");
            }
            else{
                console.log("Se trae informacion de la transaccion de retencion");
                init();
            }

            focusService.setFocus("art_trn_ret", 600);
        }

        function getTotalesBaseImp() {
            var max_renta = self.datosFactura['subt'] || 0.0;
            var max_iva = self.datosFactura['ivaval'] || 0.0;

            var lista_renta = ListasServ.filtrar(self.articulos, {ret_calc: 1});
            var lista_iva = ListasServ.filtrar(self.articulos, {ret_calc: 2});

            var total_renta = ListasServ.sumarColumna(lista_renta, 'dt_precio');
            var total_iva = ListasServ.sumarColumna(lista_iva, 'dt_precio');
            return {'total_renta': total_renta, 'total_iva': total_iva, 'max_renta': max_renta, 'max_iva': max_iva};
        }

        function getTotalesBaseImpWithoutFormdet() {
            var max_renta = self.datosFactura['subt'] || 0.0;
            var max_iva = self.datosFactura['ivaval'] || 0.0;
            var lista_renta = [];
            var lista_iva = [];
            $.each(self.tiposRetencion, function (index, fila) {
                if (index !== self.indexArtEdit) {
                    if (fila['ret_calc'] === 1) {
                        lista_renta.push(fila);
                    }
                    else if (fila['ret_calc'] === 2) {
                        lista_iva.push(fila);
                    }
                }
            });
            var total_renta = ListasServ.sumarColumna(lista_renta, 'dt_precio');
            var total_iva = ListasServ.sumarColumna(lista_iva, 'dt_precio');
            return {'total_renta': total_renta, 'total_iva': total_iva, 'max_renta': max_renta, 'max_iva': max_iva};
        }

        function verifTotales() {
            var totales = getTotalesBaseImp();
            if (self.isEditando) {
                totales = getTotalesBaseImpWithoutFormdet();
            }

            if (totales.max_renta === 0.0) {
                //No validar
            }
            else {
                var maxivaval = NumberServ.redondear(totales.max_iva, 2);
                var maxsubt = NumberServ.redondear(totales.max_renta, 2);
                var total_renta = totales.total_renta;
                var total_iva = totales.total_iva;

                var valid_iva = (self.formDetalles.ret_calc === 2);
                var bimp_ingresada = self.formDetalles.dt_precio;
                if (valid_iva) {
                    var totiva = NumberServ.redondear(Number(total_iva) + Number(bimp_ingresada), 2);
                    if (NumberServ.isNumberAMayorToB(totiva, maxivaval)) {
                        alert("El monto total de base imponible (" + totiva + ") no puede sobrepasar el total de iva del comprobante (" + maxivaval + ")");
                        return false;
                    }
                }
                else {
                    var totrent = NumberServ.redondear(Number(total_renta) + Number(bimp_ingresada), 2);
                    if (NumberServ.isNumberAMayorToB(totrent, maxsubt)) {
                        alert("La monto total de base imponible (" + totrent + ") no puede sobrepasar al subtotal del comprobante (" + maxsubt + ")");
                        return false;
                    }
                }
            }
            return true;
        }

        function onRetencionSel(item) {
            //Cargar los datos del item seleccionado en el formulario
            for (var prop in item) {
                self.formDetalles[prop] = item[prop];
            }
            self.formDetalles.dt_cant = 1;

            var base_imponible = self.datosFactura['subt'] || 0.0;
            if (item['ret_calc'] === 2) {//1:renta, 2:iva
                base_imponible = self.datosFactura['ivaval'] || 0.0;
            }
            var impuesto = base_imponible * item['ret_valor'];
            self.formDetalles.dt_precio = NumberServ.redondear(base_imponible, 2);
            self.formDetalles.dt_total = NumberServ.redondear(impuesto, 2);

            focusService.setFocus("base_imponible_ret", 200);
        }

        function editarRetencion(fila) {
            self.retencionSel.art = {};
            angular.copy(fila, self.retencionSel.art);
            self.formDetalles = {};
            angular.copy(fila, self.formDetalles);
            self.isEditando = true;
            self.indexArtEdit = self.articulos.indexOf(fila);
            focusService.setFocus("base_imponible_ret", 200);
        }

        function initFormDetalles() {
            self.formDetalles = {};
            angular.copy(self.formDetallesInit, self.formDetalles);
            self.formDetalles.dt_observ = '';
        }

        function actualizarRetencion() {
            var verif_tot = verifTotales();
            if (verif_tot) {
                self.formDetalles.dt_total = NumberServ.redondear(Number(self.formDetalles.dt_precio) * Number(self.formDetalles.ret_valor), 2);
                self.articulos[self.indexArtEdit] = self.formDetalles;
                calcularTotales();
                self.retencionSel.art = {};
                initFormDetalles();
                focusService.setFocus("art_trn_ret", 100);
                self.isEditando = false;
                self.indexArtEdit = -1;
            }
            else {
                toastr.warning("No se actualizó");
            }
        }

        function agregarActualizarRet(){
            if (self.isEditando) {
                actualizarRetencion();
            }
            else {
                agregarRetencion();
            }
        }

        function quitarRetencion(fila) {
            ListasServ.removeItem(self.articulos, fila);
            calcularTotales();
        }

        function agregarRetencion(){
            var verif_tot = verifTotales();
            if (verif_tot){
                self.formDetalles.dt_total = NumberServ.redondear(Number(self.formDetalles.dt_precio) * Number(self.formDetalles.ret_valor),2);
                if ( !self.retencionSel.art['art_codigo'] > 0 ){
                    $timeout(function(){
                        alert("Seleccione la retención");
                        focusService.setFocus("art_trn_ret",100);
                    },100);
                }
                else{
                    self.articulos.push(self.formDetalles);
                    calcularTotales();
                    self.retencionSel.art = {};
                    initFormDetalles();
                    focusService.setFocus("art_trn_ret",100);
                }
            }
            else{
                toastr.warning("No se agregó");
            }
        }

        function calcularTotales(){
            var sub12 = 0;
            var sub0 = 0;
            var subise = 0;
            var totalice = 0;
            angular.forEach(self.articulos, function(value, key){
                sub0+=value['dt_total'];
            });
            var subt = sub12 + sub0;
            var ivaval = 0.0;
            var impservval = 0.0;
            var total = subt+ivaval+impservval+totalice;

            self.formTotales.sub12 = sub12;
            self.formTotales.sub0 = sub0;
            self.formTotales.subt = subt;
            self.formTotales.ivaval = ivaval;
            self.formTotales.total = total;
            self.formTotales.impservval = impservval;
            self.formTotales.totalice = totalice;

            self.form.dt_valor = NumberServ.redondear(total, 2);
        }

        function closeModal(){
            //Validar que se haya ingresado articulos de la retencion
            self.form.datos_retencion = {
                form_datos: self.formDatos,
                impuestos: self.impuestos,
                articulos: self.articulos,
                pagos: [],
                form_totales: self.formTotales,
                listapropsadc: [],
                rep_printtype: self.rep_printtype,
                se_imprime_transacc: self.se_imprime_transacc,
                tra_tippag: self.ttransacc.tra_tippag,
                tra_codigo: self.ttransacc.tra_codigo
            };

            self.fnguardar();
        }
    }
})(IsyplusApp);