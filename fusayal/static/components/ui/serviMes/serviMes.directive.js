/**
 * Created by serviestudios on 24/02/16.
 */
(function (module) {
    'use strict';
    module.directive("serviMes", serviMes);

    /**
     * Un Dropdown menu para seleccion de mes
     * @returns {{restrict: string, replace: boolean, templateUrl: string, scope: boolean, bindToController: {form: string, formProp: string, elementid: string}, controller: controller, controllerAs: string}}
     */

    function serviMes(){
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'static/components/ui/serviMes/serviMes.html?v='+ globalgsvapp,
            scope: true,
            bindToController: {
                form: '=?',//El formulario donde se pasa el codigo del mes (1:Enero, 2:Febrero, 3:Marzo....)
                onchange: '&?',
                disabled: '=?',//Indica si el componente esta desactivado
                formProp: '@?',//Nombre de la propiead del formulario por defecto mes (form.mes)
                elementid: '@?'//id del
            },
            controller: controller,
            controllerAs: "cntrl"
        }
    }

    function controller(FechasServ, $scope){
        var self = this;
        self.labelMes = '';
        self.setMes = setMes;

        init();

        $scope.$watch("self.form", function(newValue, oldValue){
            console.log("Watch self.form serviMes:", self.form);
            if (self.form){
                init();
            }
        });

        function setMes(mes){
            self.form[self.formProp] = mes;
            setLabelMes();
            try{
                self.onchange();
            }
            catch(ex){
                console.error("Error->");
            }
        }

        function getSelectedMes(){
            return self.form[self.formProp];
        }

        function setLabelMes(){
            var mes = getSelectedMes()||1;
            self.labelMes = FechasServ.getMesLargo(mes-1);
        }

        function init(){
            console.log("init servi-mes-->");
            if (self.form){
                if (!self.formProp){
                    self.formProp= 'mes';
                }
                setLabelMes();
            }
        }
    }
})(IsyplusApp);