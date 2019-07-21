(function () {
    'use strict';
    angular.module("isyplus")
        .factory("AuthFactory", AuthFactory);

    function AuthFactory(RolesServ, GeneralSrv) {
        var userLogged = false;
        //var rolesUser = [];
        //var rolesMap = {};
        //var tuser = {};

        return {
            isUserLogged: isUserLogged,
            setUserLogged: setUserLogged,
            loadRolesUser: loadRolesUser,
            getRolesUserList: getRolesUserList,
            userHasRol: userHasRol
        }

        function isUserLogged() {
            return userLogged;
        }

        function setUserLogged(pUserLogged) {
            userLogged = pUserLogged;
        }

        function loadRolesUser(userId) {
            if (!userLogged) {
                var res = RolesServ.getRolesUser({us_id: userId}, function () {
                    console.log("valor de res es:");
                    console.log(res);
                    if (res.estado === 200) {
                        var rolesMap = {};
                        var rolesUser = res.roles;
                        rolesUser.forEach(function (value) {
                            rolesMap[value['rl_abreviacion']] = value;
                        });
                        userLogged = true;
                        //tuser = res.tuser;
                        GeneralSrv.setSSValue('tuser', res.tuser);
                        GeneralSrv.setSSValue('rolesMap', rolesMap);
                        GeneralSrv.setSSValue('rolesUser', rolesUser);
                    }
                });
            }
        }

        function isSuperUser(){
            var tuser = GeneralSrv.getSSValue('tuser');
            return tuser['us_superuser'] === 1;
        }

        function userHasRol(abrRol) {
            var rolesMap = GeneralSrv.getSSValue('rolesMap');
            if (isSuperUser()) {
                return true;
            }
            else if (rolesMap[abrRol]) {
                return true;
            }
            return false;
        }

        function getRolesUserList() {
            return GeneralSrv.getSSValue('rolesUser');
        }
    }

})();