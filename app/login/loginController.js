(function(){
    "use strict";
    (function(){
        "use strict";
        angular.module("ytApp").controller("LoginController", ["$state", "authorizationService","playlistResource", LoginController]);

        function LoginController($state, authorizationService,playlistResource){
            var vm = this;

            var tryLogIn = function(){
                return authorizationService.login();
            };

            var redirectUser = function(){
                if(authorizationService.isLoggedIn){
                    $state.go('player');
                }
                else {
                    $state.go('login');
                }
            };

            vm.login = function(){
                tryLogIn().then(redirectUser);
            };
        };

    }());
}());
