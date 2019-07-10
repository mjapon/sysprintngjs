/**
 * Created by serviestudios on 25/01/16.
 */
(function () {
    'use strict';
    angular.module("isyplus")
        .controller("ServiConversionArtController", ServiConversionArtController);

    function ServiConversionArtController(tartuniequiv, converArtService, swalService, $scope, ModalServ){
        var self = this;

        self.form = {};
        self.parents = [];
        self.parentSel = {};
        self.infoArtParent = {};
        self.infoArtEquiv = {};

        self.loadParents = loadParents;
        self.loadInfoArtEquiv = loadInfoArtEquiv;
        self.loadInfoArtParent = loadInfoArtParent;
        self.calcularNuevoStock = calcularNuevoStock;
        self.grabar = grabar;

        init();

        $scope.$on("changeConversionArtCodigoEvent", function(event, data){
            //En el contraolador padre para cambiar el codigo del articulo de equivalencia, generar un envento changeConversionArtCodigo
            //$scope.$broadcast('changeConversionArtCodigo', articulo);
            self.artCodequiv = data;
            init();
        })

        function init(){
            if (self.artCodequiv>0){
                getForm();
                loadInfoArtEquiv();
                loadParents();
            }
            else{
                //console.log(self.artCodequiv);
            }
        }

        function getForm(){
            var res = converArtService.getForm(function(){
                if (res.estado===200){
                    self.form = res.form;
                    self.form.art_codequiv = self.artCodequiv;
                }
            });
        }

        function loadParents(){
            self.parents = tartuniequiv.listarParents({art_codequiv:self.artCodequiv}, function(){
               //console.log("parents is loaded");
            });
        }

        function loadInfoArtEquiv(){
            var res = tartuniequiv.getInfoArticulo({aue_codigo:self.artCodequiv}, function(){
                if (res.estado === 200){
                    self.infoArtEquiv = res.infoart;
                }
            });
        }

        function loadInfoArtParent(){
            var res = tartuniequiv.getInfoArticulo({aue_codigo:self.parentSel.art_codigo}, function(){
                if (res.estado === 200){
                    self.infoArtParent = res.infoart;
                    self.form.art_codigo = self.parentSel.art_codigo;
                    self.form.art_cantequiv = self.parentSel.art_cantequiv;
                    calcularNuevoStock();
                }
            });
        }

        function calcularNuevoStock(){
            //infoArtEquiv.ars_exist
            self.form.nuevoStock = 0;

            var childCantEquiv = Number(self.form.cantidad) * Number(self.parentSel.art_cantequiv);
            self.form.childCantEquiv = childCantEquiv;

            try{
                if (self.form.cantidad){
                    self.form.nuevoStock = Number(self.infoArtEquiv.ars_exist) + childCantEquiv;
                }
            }
            catch(ex){
                console.log("Error al calcular nuevo stock", ex);
            }
        }

        function grabar(){
            swalService.confirm("", function(confirm){
                if (confirm){
                    var res = converArtService.save({
                        art_codigo:0, form:self.form,
                        parent: self.infoArtParent,
                        child:self.infoArtEquiv
                    }, function(){
                        //console.log("respuesta del servidor es:", res);
                        if (res.estado === 200){
                            ModalServ.hide(self.elementid);
                            toastr.success(res.msg);
                        }
                    });
                }
            });
        }
    }
})();