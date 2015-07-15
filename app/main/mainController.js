/**
 * Created by k.lyba on 13.07.2015.
 */
(function () {
    "use strict";

    angular
        .module("ytApp")
        .controller("MainController", ["$scope", "$state", "authorizationService", MainController]);

    function MainController($scope, $state, authorizationService) {
        var vm = this;
        vm.isLoggedIn = false;
        vm.userInfo = {};

        authorizationService.checkAuth().then(function () {
            vm.isLoggedIn = true;
            loadUserInfo();
        });

        var redirectUser = function () {
            if (authorizationService.isLoggedIn) {
                vm.isLoggedIn = true;
                $state.go('home.player');
            }
            else {
                $state.go('welcome');
            }
        };

        var loadUserInfo = function () {
            if (!vm.userInfo.fullName) {
                var userData = authorizationService.getUser();
                vm.userInfo.fullName = userData.name;
                vm.userInfo.picture = userData.picture;
            }
        };

        vm.logIn = function () {
            authorizationService.login()
                .then(function () {
                    return authorizationService.checkAuth();
                })
                .then(loadUserInfo)
                .then(redirectUser);
        };

        vm.logOut = function () {
            authorizationService.logOut()
                .then(null, function (data) {
                    vm.isLoggedIn = false;
                    $state.go('welcome');
                });
        };
    }
}());