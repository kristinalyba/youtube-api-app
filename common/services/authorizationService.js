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

        var login = function(){
            return GAuth.login().then(function(data){
                var token = GAuth.getToken().$$state.value.access_token;
                $http.defaults.headers.common['Authorization'] = "Bearer " + token;
            });
        };

        var getUser = function(){
            return GData.getUser();
        };

        return {
            login : login,
            getUser : getUser
        };
    }
}());
