/**
 * Created by serviestudios on 26/02/16.
 */
(function (module) {
    'use strict';
    module.directive("serviRender", rerender);
    function rerender(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'static/components/ui/rerender/rerender.html?v='+ globalgsvapp,
            scope:true,
            bindToController: {
                tituloss:'=',
                print :'=',
                probj :'='
            },
            link: link,
            controller: controller,
            controllerAs: "cntrl"
        }

        function link(scope, elment, attrs){

                console.log("entra a link valor para attrs es:");
                console.log(attrs);

            }

        function controller($scope){
                var self = this;
                init();

                self.onAttribChange = onAttribChange;

                function init(){
                    console.log("init controller-->", self.tituloss);
                    //self.tituloss = {text:'asdfasdfasdfasd'};
                }

                function onAttribChange(){
                    console.log("on attrib change-->");
                }

                $scope.$watch("cntrl.tituloss", function(newValue, oldValue){
                    console.log("watch cntrl.titulo");
                    console.log("newValue,",newValue, oldValue);
                });

            $scope.$watch("cntrl.print", function(newValue, oldValue){
                    console.log("watch cntrl.print");
                    console.log("newValue,",newValue, oldValue);
                });

            $scope.$watch("cntrl.probj.text", function(newValue, oldValue){
                    console.log("watch cntrl.probj.text");
                    console.log("newValue,",newValue, oldValue);
                });
            }
    }

})(IsyplusApp);