(function(){
    'use strict';
    angular.module("isyplus")
        .controller("HomeCntrl", HomeCntrl);

    function HomeCntrl($scope, $state, AuthFactory, $timeout) {
        var vm = $scope;

        init();

        /*
        vm.goFormIngreso = goFormIngreso;
        vm.goUsuarios = goUsuarios;
        vm.goEmpresa = goEmpresa;
        vm.goContribs = goContribs;
        vm.goAuts = goAuts;
        vm.goJobs = goJobs;
        */

        function init(){
            console.log("HomeCntrl----->");
            console.log("valor de globalUserLogged:");
            console.log(globalUserLogged);

            AuthFactory.loadRolesUser(globalUserLogged);

            $timeout(function () {
                console.log("roles cargado son");
                var listadoUser = AuthFactory.getRolesUserList();
                console.log(listadoUser);
            }, 5000);


        }



        /*
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
        */
    }
})();

