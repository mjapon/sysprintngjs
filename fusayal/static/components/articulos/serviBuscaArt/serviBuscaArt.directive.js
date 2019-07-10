/**
 * Created by serviestudios on 15/01/16.
 */
(function(){
    angular
        .module("isyplus")
        .directive("serviBuscaArt", serviBuscaArt);

    function serviBuscaArt(){
        var directive = {
            restrict: 'EA',
            templateUrl: 'static/components/articulos/serviBuscaArt/serviBuscaArt.html?v=' + globalgsvapp,
            scope: true,
            bindToController:{
                itemsel: '=',
                onItemSel: '=',
                tracodigo: '=',//Codigo de la transaccion que se envia a consulta de articulos para join con modelo contable
                elementId: '@'
            },
            controller: "ServiBuscaArtCntrl",
            controllerAs: 'cntrl'
        };

        return directive;
    }

})();
