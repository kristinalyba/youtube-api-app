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
                    templateUrl: 'src/app/main/mainView.html'
                })
                .state('home', {
                    abstract: true,
                    url: '/home',
                    templateUrl: 'src/app/home/homeView.html',
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
                    templateUrl: 'src/app/player/playerView.html'
                })
                .state('home.search', {
                    url: '/search/:searchText',
                    templateUrl: 'src/app/search/searchView.html',
                    controller: 'SearchController',
                    controllerAs: 'vm'
                })
                .state('home.edit', {
                    url: '/edit',
                    templateUrl: 'src/app/edit/editView.html',
                    controller: 'EditController',
                    controllerAs: 'vm'
                });
        }]);
}());
