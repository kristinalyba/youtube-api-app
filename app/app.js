(function () {
    "use strict";
    var app = angular.module("ytApp",
        ["common.services",
            "ui.router"]);

    app.config(["$stateProvider", "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state("home", {
                    abstract: true,
                    url: "/home",
                    templateUrl: "app/homeView.html",
                    controller: "HomeCtrl as vm"
                })
                .state("home.player", {
                    url: "/player",
                    templateUrl: "app/playerView.html",
                    controller: "PlayerCtrl as vm"
                })
                .state("home.search", {
                    url: "/search",
                    templateUrl: "app/searchView.html",
                    controller: "SearchCtrl as vm"
                });
        }])


}());
