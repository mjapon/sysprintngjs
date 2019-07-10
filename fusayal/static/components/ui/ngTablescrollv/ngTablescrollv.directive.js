/**
 * Created by root on 11/04/16.
 */
/**
 * Created by serviestudios on 05/02/16.
 */
(function () {
    'use strict';
    angular.module("isyplus")
        .directive("ngTablescrollv", ngTablescrollv);
    function ngTablescrollv($filter, $anchorScroll, $location){
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: "static/components/ui/ngTablescrollv/ngTablescrollv.html?v="+ globalgsvapp,
            scope: {
                ocultacab:'@', // no mostrar cabecera de tabla
                titulo: '@', // titulo de la tabla
                id:'@', // id de la tabla
                clspnl: '@', // clase para el panel Ej: primary, warning, default
                busq:'@',  // si se muestra o no dialogo de busq
                ordenar: '@', // si se permite ordenar por columnas o no
                filterby:'@', // para asignar la columna por la cual se filtrara en el campo de busqueda
                onclickcolheader: '=',
                txthead:'=', // texto que irá en la cabecera
                numdatos: '=', // numero de datos en caso de que no correspondan al numero de filas
                lstdatos: '=', // lista de datos a poner en la tabla
                lstcols: '=', // columnas para los datos de la tabla
                rowopc: '=', // opciones aplicables a una fila de la tabla
                colopc: '=', // opciones aplicables a las columnas de una tabla
                checks: '=', // opciones para los checkbox en la tabla
                lstopcchecks: '=', //lista de opciones de check
                botones: '=', // botones a incluir en la tabla
                filtros: '=', // para busqueda con dropdown de filtros
                selectgen: '=', //para seelct en la cabecera
                totales:'=', // en caso de necesitar incluir totales, se envian en un array
                funcchg:'=', // funcion que se ejecutará al escribir en el campo de busqueda
                modelfilt: '=', // variable donde se guardara el texto al escribir en el campo de busqueda
                striped:'=', // si la tabla tendrá la clase table-striped
                drpdwnhead: '=', // dropdown en la cabecera de una columna de la tabla
                funccombo: '=', // funcion que se activara al hacer click en un item de un combobox embebido en una celda
                footopc: '=',
                botongeneral:'=',//boton general a lado de busqueda
                btndropdown:'=',
                funcbtncol: '=', // funcion para la columna que tenga un boton
                objetodevolver: '=', // devolver valores de la directiva
                maxheight:'='
            },
            link: function(scope, elem, attrs){
                scope.busqueda = {};
                scope.form = {};
                scope.form.titulo = 'Resultados';
                scope.form.id = ''; //por defecto vacio en caso de que no se especifique id
                scope.form.clspnl = 'panel-primary';
                scope.form.numdatos = 0;
                scope.form.rowopc = {};
                scope.form.colopc = {};
                scope.form.txthead = {};
                scope.form.checks = null;
                scope.form.lstopcchecks = null;
                scope.form.filtros = null;
                scope.form.selectgen = null;
                scope.form.botongeneral = null;
                scope.form.btndropdown = null;
                scope.form.botones = null;
                scope.form.totales = [];
                scope.form.busq = true;
                scope.form.selec = 0; // para indicar el item seleccionado en el dropdown
                scope.form.reverse = false;
                scope.form.predicate = '';
                scope.form.ordenar = true;
                scope.form.cont = 0;
                scope.form.filterby = '$'; // para que se filtre por todas las columnas
                scope.form.maxheight ='300'
                scope.fecha = moment().format('DD/MM/YYYY');


                if (scope.titulo) { // cambiar el texto de Resultados
                    scope.form.titulo = scope.titulo;
                }
                if (scope.id) { // cambiar el id de la tabla
                    scope.form.id = scope.id;
                }
                if (scope.clspnl) {
                    scope.form.clspnl = scope.clspnl;
                }
                if (scope.rowopc) { // opciones de fila
                    scope.form.rowopc = scope.rowopc;
                }
                if (scope.colopc) { // opciones de columna
                    scope.form.colopc = scope.colopc;
                }
                if (scope.checks) { //opciones de checkbox
                    scope.form.checks = scope.checks;
                }
                if (scope.lstopcchecks) { //opciones de checkbox
                    scope.form.lstopcchecks = scope.lstopcchecks;
                }
                if (scope.botones) { //opciones de botones
                    scope.form.botones = scope.botones;
                }
                if (scope.botongeneral) { //botongeneral
                    scope.form.botongeneral = scope.botongeneral;
                }
                console.log("scope.btndropdown")
                console.log(scope.btndropdown)
                if (scope.btndropdown) { //btndropdown

                    scope.form.btndropdown = scope.btndropdown;
                }
                if (scope.filtros) { //dropdowns de filtros
                    console.log("llega filtros")
                    console.log(scope.filtros)
                    scope.form.filtros = scope.filtros;
                }
                if (scope.selectgen) {
                    console.log("llega selectgen")
                    console.log(scope.selectgen)
                    scope.form.selectgen = scope.selectgen;
                }
                if (scope.busq) { //para mostrar o no el dialogo de busqueda
                    scope.form.busq = scope.busq;
                }
                if (scope.ordenar) { //para hacer q las columnas se ordenen o no
                    scope.form.ordenar = scope.ordenar;
                }

                if (scope.filterby) { // para especificar columna a filtrar en la tabla
                    scope.form.filterby = scope.filterby;
                }
                if (scope.txthead) { // texto en la cabecera de la tablas
                    scope.form.txthead = scope.txthead;
                }
                if (scope.maxheight){
                    scope.form.maxheight = scope.maxheight;
                }




                scope.$watchCollection(
                    "lstcols",
                    function( newLst, oldLst ) {
                        if (scope.lstcols && newLst) {
                            scope.form.lstcols = newLst;
                        }
                    }
                );

                scope.$watchCollection(
                    "lstdatos",
                    function( newLst, oldLst) {
                        if (scope.lstdatos && newLst) {
                            scope.form.lstdatos = newLst;
                            if (!scope.numdatos) {
                                scope.form.numdatos = scope.form.lstdatos.length;
                            }
                            var obj =document.getElementById('clscroll-column-headers-tra').style
                            console.log("cambia padding")
                            obj.paddingRight= '0px';
                        }
                    }
                );

                scope.$watchCollection(
                    "totales",
                    function( newLst, oldLst ) {
                        if (scope.totales && newLst) {
                            scope.form.totales = newLst;
                        }
                    }
                );

                scope.$watch(
                    "numdatos",
                    function(newVal, oldVal){
                        if (scope.numdatos) {
                            scope.form.numdatos = newVal;
                        }
                    }
                );
                scope.$watch(
                    "titulo",
                    function(newVal, oldVal){
                        if (scope.titulo) {
                            scope.form.titulo = newVal;
                        }
                    }
                );
                scope.$watch(
                    "objetodevolver",
                    function(newVal, oldVal){
                        if (scope.objetodevolver) {
                            scope.form.objetodevolver = newVal;
                        }
                    }
                );

                scope.$watchCollection(
                    "selectgen.lstselect",
                    function( newLst, oldLst ) {
                        if(scope.form.selectgen){
                            scope.form.selectgen.lstselect = newLst;
                        }

                    }
                );
                scope.$watch( // para q se actualize el modelfilt si se cambia desde el controlador
                    "modelfilt",
                    function(newVal, oldVal){
                        if (newVal != undefined) {
                            scope.busqueda[scope.form.filterby] = newVal;
                        }
                    }
                );
                scope.$watch("checks.chkAll",
                    function(newVal, oldVal){
                        if (scope.form.checks) {
                            scope.form.checks.chkAll = newVal ;
                        }
                    }
                );




                scope.setSelec = function(i){
                    scope.form.selec = i;
                    if(scope.form.selectgen){
                        scope.form.selectgen.model='';
                    }
                };

                scope.onChgBusqueda = function(txt){ // para enviar lo escrito en el campo de busqueda
                    if (scope.modelfilt !== undefined) {
                        scope.modelfilt = txt; //se envia el texto de busqueda
                    }
                    if (scope.funcchg) {
                        scope.funcchg();
                    }
                };

                scope.setOrder = function(val){
                    scope.form.reverse = !scope.form.reverse;
                    scope.form.predicate = val;
                    if(scope.objetodevolver){
                        scope.objetodevolver.reverse = scope.form.reverse;
                        scope.objetodevolver.predicate = scope.form.predicate;
                        console.log(scope.objetodevolver)
                    }

                    if (scope.form.ordenar === true) {
                        scope.form.lstdatos = $filter('orderBy')(scope.form.lstdatos, scope.form.predicate, scope.form.reverse);
                    }
                };
                scope.fnTrackBy = function(item, index){ // para poder enviar el index en los botones
                    item.$index_row = index;
                    return item.$index_row;
                };
                scope.filtrar = function(filtro, valor){ // para asignar filtro a lo asignado en la celda
                    var fil = filtro.split(':');
                    if (filtro==='$') {
                        return filtro + valor;
                    } else if (filtro==='%') {
                        return valor + filtro;
                    } else if (fil.length === 1){
                        return $filter(fil[0])(valor);
                    } else if (fil.length === 2) {
                        return $filter(fil[0])(valor, fil[1]);
                    } else if (fil.length === 3) {
                        return $filter(fil[0])(valor, fil[1], fil[2]);
                    }
                };
                scope.setIdCol = function(indexrow, indexcol){
                    return scope.form.id+'c'+indexrow+''+indexcol;
                };
                scope.onKeyUpColEdit = function(idxrow, idxcol, type, value){
                    //var idcol = 'c'+idxrow+''+idxcol;
                    //var elem = document.getElementById(idcol);
                    //if (value && type === 'number' && !NumberServ.isNumber(value)) {
                    //    //elem.style.border = "2px dashed red";
                    //} else {
                    //    //elem.style.border = "transparent";
                    //}
                };

                scope.gotoUp = function(){
                    $('html, body').animate({
                        scrollTop: elem.offset().top
                    }, 250);
                };


                scope.onchecklista = function(lt,o){
                    for (var n=0;n<lt.length;n++ ) {
                        if(o.valor!=lt[n].valor){
                            lt[n].sel=false;
                        }
                    }
                    o.sel= !o.sel
                }
                scope.asiganachecksprop = function(col) {
                    console.log("entra asiganachecksprop")
                    var i=0;
                    col.check.selectall = !col.check.selectall || false;
                    if(col.check.selectall){
                        for (i; i<scope.form.lstdatos.length;i++){
                            scope.form.lstdatos[i][col.prop]= col.check.valuecheck;
                        }
                    }else{
                        for (i; i<scope.form.lstdatos.length;i++){
                            scope.form.lstdatos[i][col.prop]= col.check.valuenocheck;
                        }
                    }

                }
                scope.clickcolheader = function(campo){
                    if(scope.onclickcolheader){
                        scope.onclickcolheader(campo);
                    }else{
                        console.log("no se ha declarado la funcion onclickcolheader")
                    }
                }
                scope.cambiaCheck = function(i,c){
                    c.check.selectall = false;
                    if(i[c.prop] === c.check.valuecheck){
                        i[c.prop] = c.check.valuenocheck;
                    }else{
                        i[c.prop] = c.check.valuecheck;
                    }
                }

                 $("#clscroll-content-tra").scroll(function() {
                    var obj =document.getElementById('clscroll-column-headers-tra').style
                    obj.paddingRight= '15px';
                });
            }
        }
    }
})();