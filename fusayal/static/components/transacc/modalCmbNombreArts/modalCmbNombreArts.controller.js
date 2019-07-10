/**
 * Created by serviestudios on 10/05/16.
 */
(function (module) {
    'use strict';

    module.controller("ModalCmbNombreArtCntrl", ModalCmbNombreArtCntrl);

    function ModalCmbNombreArtCntrl($scope, ModalServ, ListasServ, NotifServ, focusService) {
        var self = this;

        self.isRowMarked = false;
        self.newPrintName = "";
        self.isHeadMarked = 0;

        self.ok = ok;
        self.changeName = changeName;
        self.toggleRowMark = toggleRowMark;
        self.toggleHeadMark = toggleHeadMark;

        $scope.$watch("self.articulos", watchArticulos);
        $scope.$watch("self.isRowMarked", watchIsRowMarked);

        function watchArticulos(newValue, oldValue) {
            console.log("watch self.articulos--->", newValue);
        }

        function watchIsRowMarked(newValue, oldValue){
            if (newValue){
                focusService.setFocus("newPrintName",1500);
            }
        }

        function toggleHeadMark(){
            self.isHeadMarked = self.isHeadMarked ? 0 : 1;
            updateAllMark(self.isHeadMarked);
            updateIsRowMarked();
        }

        function updateAllMark(markValue){
            $.each(self.articulos, function(rowIndex, row){
                row.mark = markValue;
            });
        }

        function toggleRowMark(row) {
            row.mark = row.mark === 1 ? 0 : 1;
            updateIsRowMarked();
        }

        function updateIsRowMarked(){
            var marcados = getMarkedRows();
            self.isRowMarked = marcados && marcados.length>0;
        }

        function changeName(){
            if (self.newPrintName.length>0){
                var marcados = getMarkedRows();
                if (marcados && marcados.length>0){
                    $.each(marcados, function(rowIndex, row){
                        row.art_nomimp = self.newPrintName;
                    });
                }
                NotifServ.success("Nombre asignado");
                reset();
            }
        }

        function getMarkedRows(){
            return ListasServ.filtrar(self.articulos, {mark:1});
        }

        function reset() {
            self.newPrintName = "";
            self.isRowMarked = false;
            self.isHeadMarked = 0;
            updateAllMark(self.isHeadMarked);
        }

        function ok(){
            console.log("cerrar--->", self.elementid);
            ModalServ.hide(self.elementid);
        }
    }

})(IsyplusApp);