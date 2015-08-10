(function () {
    'use strict';
    var app = angular.module('ytApp', ['common.services',
            'ui.router', 'ui.bootstrap'
        ]);

    app.config(['$stateProvider', '$urlRouterProvider', '$sceDelegateProvider',
        function ($stateProvider, $urlRouterProvider, $sceDelegateProvider) {

            $sceDelegateProvider.resourceUrlWhitelist([
                'self',
                'https://www.youtube.com/**',
                'https://youtu.be/**',
                'https://accounts.google.com/**'
            ]);

            $urlRouterProvider.otherwise('/home/player');

            $stateProvider
                .state('main', {
                    url: '/',
                    templateUrl: 'app/main/mainView.html'
                })
                .state('home', {
                    abstract: true,
                    url: '/home',
                    templateUrl: 'app/home/homeView.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    resolve: {
                        authCheck: function (authorizationService, $state) {
                            return authorizationService
                                .checkAuth()
                                .then(function () {
                                        authorizationService
                                            .setAuthToken();
                                    },
                                    function () {
                                        $state.go('main');
                                    });
                        }
                    }
                })
                .state('home.player', {
                    url: '/player',
                    templateUrl: 'app/player/playerView.html'
                })
                .state('home.search', {
                    url: '/search/:searchText',
                    templateUrl: 'app/search/searchView.html',
                    controller: 'SearchController',
                    controllerAs: 'vm'
                })
                .state('home.edit', {
                    url: '/edit',
                    templateUrl: 'app/edit/editView.html',
                    controller: 'EditController',
                    controllerAs: 'vm'
                });
        }]);
}());
