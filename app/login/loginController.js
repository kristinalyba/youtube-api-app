(function(){
    "use strict";
    (function(){
        "use strict";
        angular.module("ytApp").controller("LoginController", ["$scope", "$state", "authorizationService", LoginController]);

        function LoginController($scope, $state, authorizationService){
            var vm = this;

            var tryLogIn = function(){
                return authorizationService.login();
            };

            var redirectUser = function(){
                if(authorizationService.isLoggedIn){
                    $scope.$parent.isLoggedIn = true;
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
