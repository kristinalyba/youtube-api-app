(function(){
    "use strict";
    (function(){
        "use strict";
        angular.module("ytApp").controller("LoginController", ["$state", "authorizationService", LoginController]);

        function LoginController($state, authorizationService){
            var vm = this;

            var tryLogIn = function(){
                return authorizationService.login();
            };

            var redirectUser = function(){
                if(authorizationService.isLoggedIn){
                    $state.go('home.player');
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