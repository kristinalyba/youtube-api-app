(function(){
    "use strict";
    angular.module("ytApp").controller("OverviewController", ["ytApiService", OverViewController]);
    
    function OverViewController(ytApiService){
        var vm = this;
                
        ytApiService.then(function(data){
            vm.auth = data;
        })
    };
    
}());