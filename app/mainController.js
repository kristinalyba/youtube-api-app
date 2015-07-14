/**
 * Created by k.lyba on 13.07.2015.
 */
(function () {
    "use strict";

    angular
        .module("ytApp")
        .controller("MainController", ["$scope", "$state","authorizationService", MainController]);

    function MainController($scope, $state, authorizationService) {
        var vm = this;
        $scope.isLoggedIn = false;

        authorizationService.checkAuth().then(function(){
            $scope.isLoggedIn = true;
        }, function(){
            $scope.isLoggedIn = false;
        });

        vm.logOut = function () {
            authorizationService.logOut()
                .then(null, function (data) {
                    $scope.isLoggedIn = false;
                    $state.go('login');
                });
        }
    }
}());