(function(){
    "use strict";
    var app = angular.module("ytApp", ["angular-google-gapi"]);
    
    app.run(['GData', 'GAuth', 'GApi', '$rootScope', '$window',
    function(GData, GAuth, GApi, $state, $rootScope, $window) {

        var API_TOKEN ="AIzaSyDoH2AjDiCWgdm18lHyusZ_m2gbswCGDI4";
        var CLIENT_ID = '277572490754-mv9uu31naka02tfef9cv7kv6ntfqvioa.apps.googleusercontent.com';
        var YT_API_BASE = "https://www.googleapis.com/youtube/v3/";

        GApi.load('youtube', 'v3');
        GAuth.setClient(CLIENT_ID);
        GAuth.setScope('https://www.googleapis.com/auth/youtube');
        var isLoggedIn = GData.isLogin();
        GAuth.checkAuth().then(
            function () {
                var arr = 1;
            },
            function(){
                var arr = 2;
            }
        );
        GAuth.login().then(function(){
            var res = 1;
        });

        $rootScope.logout = function() {
            GAuth.logout().then(
            function () {});
        };
    }
]);
    
}());
