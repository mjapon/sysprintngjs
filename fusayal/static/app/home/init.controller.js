(function () {
    'use strict';
    angular.module("isyplus")
        .controller("InitCntrl", InitCntrl);

    function InitCntrl($scope, $state, LoginServ, NotifServ, AlertSrv, AuthFactory, GeneralSrv) {

        var vm = $scope;

        vm.ipServer = GeneralSrv.getIPServer();

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
        vm.salirSys = salirSys;

        init();

        function init() {
            console.log("InitCntrl ejecutado ----->");
            //$state.go("home");
            console.log(globalUserLogged);
            AuthFactory.loadRolesUser(globalUserLogged);
        }

        function salirSys() {
            AlertSrv.confirm("¿Seguro que desea salir?", function (isConfirm) {
                if (isConfirm) {
                    window.location.href = 'http://' + vm.ipServer + ':6543/logout';
                }
            });
        }

        function exitApp() {
            $state.go("home");
        }

        function goFormIngreso() {
            $state.go("login");
        }

        function checkRol(rol) {
            if (AuthFactory.userHasRol(rol)) {
                return true;
            }
            else {
                AlertSrv.warning('Acceso no autorizado');
                return false;
            }
        }

        function goUsuarios() {
            if (checkRol('LISTAUSER')) {
                $state.go("usuarios");
            }
        }

        function logout() {
            console.log("logout");
        }

        function goEmpresa() {
            if (checkRol('EMPRESAEDIT')) {
                $state.go("empresa");
            }
        }

        function goContribs() {
            if (checkRol('LISTACONTRIB')) {
                $state.go("contribs_list");
            }
        }

        function goAuts() {
            if (checkRol('LISTAAUT')) {
                $state.go("auts_list");
            }
        }

        function goJobs() {
            if (checkRol('LISTADOC')) {
                $state.go("job_list");
            }
        }

        function goReportes() {
            if (checkRol('ACCESPLANTILLAS')) {
                $state.go("reportes_list");
            }
        }

        function goJobWizard() {
            $state.go("job_step");
        }

        function goReportesSys() {
            if (checkRol('ACCESREPORTES')) {
                $state.go("reportes_sys");
            }
        }
    }

})();