(function () {
    "use strict";
    var app = angular.module("ytApp",
        ["common.services",
            "ui.router"
        ]);

    app.config(["$stateProvider", "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/home/player");

            $stateProvider
                .state("login", {
                    url: "/login",
                    templateUrl: "app/login/loginView.html",
                    controller: "LoginController",
                    controllerAs: "vm"
                })
                .state("home", {
                    abstract: true,
                    url: "/home",
                    templateUrl: "app/home/homeView.html",
                    controller: "HomeController",
                    controllerAs: "vm",
                    resolve: {
                            authCheck: function(authorizationService, $state){
                                return authorizationService
                                    .checkAuth()
                                .then(function(){},
                                      function(){
                                    $state.go('login')
                                });
                            }
                    }
                })
                .state("home.player", {
                    url: "/player",
                    templateUrl: "app/player/playerView.html",
                    controller: "PlayerController",
                    controllerAs: "vm"
                })
                .state("home.search", {
                    url: "/search",
                    templateUrl: "app/search/searchView.html",
                    controller: "SearchController",
                    controllerAs: "vm"
                })
                .state("home.edit", {
                    url: "/edit",
                    templateUrl: "app/edit/editView.html"
                });
        }]);
}());
