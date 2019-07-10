/**
 * Created by serviestudios on 01/02/16.
 */

(function () {
    'use strict';
    angular
        .module("isyplus")
        .directive("serviFecha", serviFecha);

    function serviFecha(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'static/components/ui/serviFecha/serviFecha.html?v='+ globalgsvapp,
            link: link,
            scope: true,
            bindToController: {
                model: '=',
                disabled: '=',
                required: '=',
                pattern: '=',
                classinput:'@',
                classinputgroup: '@',
                elementid: '@'
            },
            controller: controller,
            controllerAs: "cntrl"
        }


        function link(scope, element, attrs){
            /*
            element.datetimepicker({
                format: 'DD/MM/YYYY',
                defaultDate: moment(),
                showTodayButton: true,
                locale:'es'
            });
            */
        }

        function controller($element, $timeout, $scope, $attrs, FechasServ){
            var self = this;

            self.onEnter = onEnter;
            setupDatepickerChange();

            function setupDatepickerChange(){
                //Cuando se crea el componente
                var defaultDate = moment();
                $element.datetimepicker({
                    format: 'DD/MM/YYYY',
                    defaultDate: defaultDate,
                    showTodayButton: true,
                    locale:'es'
                });

                $element.on("dp.change", function (e) {
                    $timeout(function(){
                        try{
                            var fecha = e.date.format('DD/MM/YYYY');
                            self.model = fecha;
                            onEnter();
                        }
                        catch(ex){
                            self.model = '';
                        }
                    });
                });
            }

            function onEnter() {
                $timeout(function(){
                    try{
                        $scope.$eval($attrs.onenter);
                    }
                    catch (ex){
                        console.error("Error en val $attrs.onenter");
                        console.error(ex);
                    }
                });
            }
        }
    }
})();