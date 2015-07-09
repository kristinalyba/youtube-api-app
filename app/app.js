(function(){
    "use strict";
    var app = angular.module("ytApp",
                             ["common.services",
                              "ui.router"
                             ]);

    app.config(["$stateProvider", "$urlRouterProvider",
                function($stateProvider, $urlRouterProvider){
                    $stateProvider
                        .state("login", {
                        url: "/login",
                        templateUrl: "app/login/loginView.html",
                        controller: "LoginController",
                        controllerAs: "vm"
                    })
                        .state("home", {
                        abstract: true,
                        url: "/",
                        templateUrl: "app/home/homeView.html",
                        controller: "HomeController",
                        controllerAs: "vm",
                    })
                        .state("home.player", {
                        url: "/player",
                        templateUrl: "app/player/playerView.html"

                    })
                        .state("home.search", {
                        url: "/search",
                        templateUrl: "app/search/searchView.html"

                    })
                        .state("home.edit", {
                        url: "/edit",
                        templateUrl: "app/edit/editView.html"

                    });

                    $urlRouterProvider.otherwise("/");

    }]);
}());
