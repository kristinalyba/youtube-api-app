/**
 * Created by k.lyba on 13.07.2015.
 */
(function () {
    "use strict";

    angular
        .module("ytApp")
        .controller("MainController", ["authorizationService", MainController]);

    function MainController(authorizationService) {
        var vm = this;

        var appPath = "http://" + window.location.hostname + ":" + window.location.port + window.location.pathname;
        vm.googleLogoutPath = "https://accounts.google.com/Logout?&continue=https://appengine.google.com/_ah/logout?continue=" + appPath;

        vm.isLoggedIn = authorizationService.isLoggedIn;
    }
}());