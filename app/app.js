(function(){
    "use strict";
    angular.module("ytApp", ["angular-google-gapi"]);
    
    app.run(['GAuth', 'GApi', '$state', '$rootScope', '$window',
    function(GAuth, GApi, $state, $rootScope, $window) {

        var API_TOKEN ="AIzaSyDoH2AjDiCWgdm18lHyusZ_m2gbswCGDI4";
        var CLIENT_ID = '526374069175-4vv42arm0ksdr9a1lgkve6vbktfkmlvv.apps.googleusercontent.com';
        var YT_API_BASE = "https://www.googleapis.com/youtube/v3/";

        GApi.load('myContactApi', 'v1', BASE);
        GApi.load('calendar', 'v3');
        GAuth.setClient(CLIENT);
        GAuth.setScope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly');
        GAuth.checkAuth().then(
            function () {
                if($state.includes('login'))
                    $state.go('home');
            },
            function() {
                $state.go('login');
            }
        );

        $rootScope.logout = function() {
            GAuth.logout().then(
            function () {
                $state.go('login');
            });
        };
    }
]);
    
}());