(function(){
    "use strict";
    angular
    .module("common.services")
    .factory("authorizationService", ["$http", "GAuth", "GData", authorizationService]);

    function authorizationService($http, GAuth, GData){
        var CLIENT_ID = '277572490754-mv9uu31naka02tfef9cv7kv6ntfqvioa.apps.googleusercontent.com';
        var AUTH_SCOPE = "https://www.googleapis.com/auth/youtube";

        GAuth.setClient(CLIENT_ID);
        GAuth.setScope(AUTH_SCOPE);

        function login(){
            return GAuth.login().then(function(){
                var token = GAuth.getToken().$$state.value.access_token;
                $http.defaults.headers.common['Authorization'] = "Bearer " + token;
            });
        };

        function getUser(){
            return GData.getUser();
        };

        function isLoggedIn(){
            return GData.isLogin();
        };

        function checkAuth(){
            return GAuth.checkAuth();
        };

        function logOut(){
            return GAuth.logout();
        };

        return {
            login : login,
            getUser : getUser,
            isLoggedIn : isLoggedIn,
            checkAuth : checkAuth,
            logOut : logOut
        }
    }
}());
