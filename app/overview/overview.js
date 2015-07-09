(function(){
    "use strict";
    angular.module("ytApp").controller("OverviewController", ["authorizationService","playlistResource", OverViewController]);
    
    function OverViewController(authorizationService,playlistResource){
        var vm = this;
        authorizationService.login().then(function(){
            vm.userInfo = authorizationService.getUser();
            var playlists = playlistResource.query(function(){
                console.log(playlists);
            });
        });
    };
}());
