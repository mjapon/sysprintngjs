(function () {
    'use strict';
    angular.module("isyplus")
        .controller("ReportesSysCntrl", ReportesSysCntrl);

    function ReportesSysCntrl($scope, ReportesServ, gridService, $state) {

        var vm = $scope;

        vm.listar = listar;
        vm.selReporte = selReporte;
        vm.selectedItem = {};
        vm.reportesList = [];

        //var ipServer = "157.230.129.131";
        var ipServer = "localhost";


        vm.imprimir = imprimir;

        init();

        function init() {
            console.log("Reportes Sys Cntrl Init executed-->");
            listar();
        }

        function listar(){
            console.log('Se ejecuta accion listar');

            var res = ReportesServ.get({tipo:2}, function(){
                if (res.status === 200){
                    vm.reportesList = res.items;
                    console.log("reportes list es:");
                    console.log(vm.reportesList);
                }
            });

            /*var res = ReportesServ.get(function () {
                console.log("Respuesta del servidor es");
                console.log(res);
                if (res.status == 200) {
                    vm.lista = res.lista;
                }
            });*/
        }

        function selReporte(rep) {
            console.log('reporte sel');
            console.log(rep);

            vm.selectedItem = rep;
        }
        
        function imprimir() {

            var generadopor = "generadorpor";
            var paramdesc = "paramdesc";
            var codigorep = vm.selectedItem.temp_id;

            var url = "http://"+ipServer+":8080/imprentas/ReportePathServlet?generadopor=" + generadopor + "&paramdesc=" + paramdesc + "&codigorep=" + codigorep;
            console.log('url-->');
            console.log(url);
            window.open(url, "mywindow", "status=1,toolbar=1");

        }
    }

})();