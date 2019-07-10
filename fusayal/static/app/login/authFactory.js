(function () {
    'use strict';
    angular.module("isyplus")
        .factory("AuthFactory", AuthFactory);

    function AuthFactory(RolesServ) {
        var userLogged = false;
        var rolesUser = [];

        return {
            isUserLogged: isUserLogged,
            setUserLogged: setUserLogged,
            loadRolesUser: loadRolesUser,
            getRolesUserList: getRolesUserList
        }

        function isUserLogged() {
            return userLogged;
        }

        function setUserLogged(pUserLogged) {
            userLogged = pUserLogged;
        }

        function loadRolesUser(userId) {
            var res = RolesServ.getRolesUser({us_id: userId}, function () {
                console.log("valor de res es:");
                console.log(res);
                if (res.estado === 200) {
                    rolesUser = res.roles;
                }
            });
        }

        function getRolesUserList() {
            return rolesUser;
        }
    }

})();