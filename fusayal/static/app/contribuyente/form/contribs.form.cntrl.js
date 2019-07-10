(function () {
    'use strict';
    angular.module("isyplus")
        .controller("ContribFormCntrl", ContribFormCntrl);

    function ContribFormCntrl($scope, $state, $stateParams, focusService, ContribuyenteServ, NotifServ) {

        var vm = $scope;

        vm.form = {'cnt_id': 0};
        vm.tiposcontrib = [];
        vm.existeContrib = false;
        vm.isEnterPress = false;

        init();

        vm.guardar = guardar;
        vm.cancelar = cancelar;
        vm.onEnterPress = onEnterPress;
        vm.onBlurRuc = onBlurRuc;
        vm.setFocusField = setFocusField;

        vm.checkExistContrib = checkExistContrib;

        function init() {
            var res = ContribuyenteServ.getForm({cnt_id: $stateParams.cnt_id}, function () {
                if (res.estado === 200) {
                    vm.form = res.form;
                    vm.tiposcontrib = res.tiposcontrib;

                }
            });
            focusService.setFocus("cnt_ruc", 500);
        }

        function guardar() {
            var res = ContribuyenteServ.save(vm.form, function () {
                if (res.estado === 200) {
                    NotifServ.success(res.msg);
                    goToList();
                }
            });
        }

        function cancelar() {
            $state.go("contribs_list");
        }

        function goToList() {
            $state.go("contribs_list");
        }

        function onEnterPress() {
            vm.isEnterPress = true;
            checkExistContrib();
        }

        function onBlurRuc() {
            if (!vm.isEnterPress) {
                checkExistContrib();
            }
        }

        function setFocusField(inputId) {
            focusService.setFocus(inputId);
        }

        function checkExistContrib() {
            console.log("checkExistContrib-->");
            console.log(vm.form.cnt_id);
            console.log(vm.form.cnt_id > 0);

            if (vm.form.cnt_id === 0) {
                if (vm.form.cnt_ruc.length > 10) {
                    if (vm.form.cnt_id === 0) {
                        var res = ContribuyenteServ.findByRuc({ruc: vm.form.cnt_ruc}, function () {
                            if (res.estado === 200) {
                                NotifServ.warning('El contribuyente ya esta registrado');
                                vm.form = res.contrib;
                                vm.existeContrib = true;
                            }
                            else if(res.estado === 404){
                                NotifServ.info('El contribuyente no está registrado');
                                focusService.setFocus("cnt_razonsocial", 100);
                            }
                        });
                    }
                }
            }
            else{
                console.log("Ya no se chequea si contribuyetne exites--->");
            }
        }
    }

})();