(function(){
    "use strict";
    angular.module("ytApp").controller("OverviewController", ["authorizationService", OverViewController]);
    
    function OverViewController(authorizationService){
        var vm = this;
        authorizationService.login().then(function(){
            vm.userInfo = authorizationService.getUser();
        });
    };
}());
