(function () {
    'use strict';
    angular.module("isyplus")
        .controller("InitCntrl", InitCntrl);

    function InitCntrl($scope, $state, LoginServ, NotifServ, AuthFactory) {

        var vm = $scope;


        vm.isUsserLogged = false;
        vm.exitApp = exitApp;
        vm.goFormIngreso = goFormIngreso;
        vm.goUsuarios = goUsuarios;
        vm.goEmpresa = goEmpresa;
        vm.goContribs = goContribs;
        vm.goAuts = goAuts;
        vm.goJobs = goJobs;
        vm.goReportes = goReportes;
        vm.goJobWizard = goJobWizard;
        vm.goReportesSys = goReportesSys;

        init();


        function init(){
            console.log("InitCntrl ejecutado ----->");
            //$state.go("home");
        }


        function exitApp(){
            $state.go("home");
        }

        function goFormIngreso(){
            $state.go("login");
        }

        function goUsuarios() {
            $state.go("usuarios");
        }

        function logout(){
            console.log("logout");
        }

        function goEmpresa(){
            $state.go("empresa");
        }

        function goContribs(){
            $state.go("contribs_list");
        }

        function goAuts() {
            $state.go("auts_list");
        }

        function goJobs(){
            $state.go("job_list");
        }

        function goReportes() {
            $state.go("reportes_list");
            // $state.go("upload");
        }

        function goJobWizard() {
            $state.go("job_step");
        }

        function goReportesSys() {
            $state.go("reportes_sys");
        }
    }

})();