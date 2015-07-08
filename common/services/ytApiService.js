(function(){
    "use strict";
    angular
    .module("ytApp")
    .factory("ytApiService", ["$http", "GAuth", ytApiService]);

    function ytApiService($http, GAuth){
        var API_KEY = "AIzaSyDoH2AjDiCWgdm18lHyusZ_m2gbswCGDI4";
        var CLIENT_ID = '277572490754-mv9uu31naka02tfef9cv7kv6ntfqvioa.apps.googleusercontent.com';
        var AUTH_SCOPE = "https://www.googleapis.com/auth/youtube";
        var TMPLT_URL = "https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=http%3A%2F%2F127.0.0.1%2Foauth2callback&scope=${authScope}&response_type=token";
        var auth = GAuth;
        gapi.client.setApiKey(API_KEY);
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
        
        function handleAuthResult(authResult) {
            var authorizeButton = document.getElementById('authorize-button');
            if (authResult && !authResult.error) {
                //success
                makeApiCall();
            } else {
                //error
            }
        }

        return $http.get(TMPLT_URL.replace("${clientId}", CLIENT_ID).replace());
    };
    
    
}());