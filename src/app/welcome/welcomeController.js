(function () {
    angular
        .module('ytApp')
        .controller('WelcomeController', ['$scope', 'PubSub', 'authorizationService', WelcomeController]);

    function WelcomeController($scope, PubSub, authorizationService) {
        vm = this;
        vm.isLoggedIn = authorizationService.isLoggedIn();

        var cleanUpFunc = PubSub.subscribe('loggedIn', function (isLoggedIn) {
            vm.isLoggedIn = isLoggedIn;
        });

        $scope.$on('$destroy', function () {
            cleanUpFunc();
        });
    }
}());
