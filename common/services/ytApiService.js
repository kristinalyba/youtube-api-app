(function(){
    "use strict";
    angular
    .module("ytApp")
    .factory("ytApiService", ["$http", "GAuth", ytApiService]);

    function ytApiService($http, GAuth){
        var CLIENT_ID = '277572490754-mv9uu31naka02tfef9cv7kv6ntfqvioa.apps.googleusercontent.com';
        var AUTH_SCOPE = "https://www.googleapis.com/auth/youtube";

        GAuth.setClient(CLIENT_ID);
        GAuth.setScope(AUTH_SCOPE);
        return {login: GAuth.login};
    }
}());
