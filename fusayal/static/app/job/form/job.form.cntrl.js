(function () {
    'use strict';
    angular.module("isyplus")
        .controller("JobFormCntrl", JobFormCntrl);
    
    function JobFormCntrl($scope, $stateParams, $state, JobService,
                          AutorizacionServ, NotifServ, focusService, ListasServ) {

         var vm = $scope;

         vm.form = {};
         vm.contribsel = {};
         vm.listas ={contributentes:[], auts:[]};
         vm.autsel = undefined;

         vm.guardar = guardar;
         vm.cancelar = cancelar;
         vm.onContribSel = onContribSel;
         vm.onAutChange = onAutChange;

         init();

         function init(){
             var jobid = $stateParams.job_id;
             var res = JobService.getForm({job_id:jobid}, function () {
                 if (res.estado === 200){
                     vm.form = res.form;
                     vm.listas.contributentes = res.contribs;
                     focusService.setFocus('ruccontrib', 500);
                 }
             });
         }

         function loadAuts(){
             var res = AutorizacionServ.getContribAuts({cnt_id:vm.contribsel.cnt_id}, function(){
                 if (res.estado == 200){
                     vm.listas.auts = res.items;
                     focusService.setFocus('aut_id', 100);
                 }
             });
         }

         function guardar(){
             var res = JobService.save(vm.form, function () {
                 if (res.estado === 200){
                     NotifServ.success(res.msg);
                     goToList();
                 }
             });
         }

         function onContribSel(contribsel){
            if (contribsel){
                vm.form.cnt_id = contribsel.cnt_id;
                focusService.setFocus("aut_estab", 100);
                vm.contribsel = contribsel;
                loadAuts();
            }
         }

         function onAutChange(){
             var autfinded = ListasServ.buscarObjeto(vm.listas.auts, 'aut_id', vm.form.aut_id);
             vm.autsel =autfinded;
         }

         function goToList() {
             $state.go("job_list");
         }

         function cancelar(){
             goToList();
         }
    }

})();