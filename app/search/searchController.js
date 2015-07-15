/**
 * Created by k.lyba on 09.07.2015.
 */
(function(){
    "use strict";

    angular
        .module("ytApp")
        .controller("SearchController", ["searchResource","playlistitemsResource","$stateParams",SearchController]);

    function SearchController(searchResource,playlistitemsResource,$stateParams){
        var vm = this;
        vm.playlist =[];
        vm.searchResult =[];
        vm.searchtext = $stateParams.searchtext;
        vm.playlistId = $stateParams.selectedPlaylistId;

        var searching = function(){
            searchResource.query({d: vm.searchtext}, function (data) {
                    for (var i = 0; i < data.items.length; i++) {
                        vm.searchResult.push(data.items[i]);
                        var searchItem = vm.searchResult[i];
                        searchItem.isExisted = _.find(vm.playlist, function (item) {
                            return item.snippet.resourceId.videoId === searchItem.id.videoId;
                        });
                    }
                }
            )};

        vm.addToPlayList = function(searchItem)
        {
            var index = vm.getIndex(searchItem);

            if(index >= 0)
            {
                var newitem = new playlistitemsResource();
                newitem.snippet = {};
                newitem.snippet.playlistId = vm.playlistId;
                newitem.snippet.resourceId = { kind: "youtube#video" ,videoId: searchItem.id.videoId};

                playlistitemsResource.save(newitem, function() {
                        vm.searchResult[index].isExisted = true;
                    },function()
                    {
                    }
                );
            }
        };

        vm.getIndex = function(searchItem)
        {
            return _.findIndex(vm.searchResult, function (item) {
                return item.id === searchItem.id;
            });
        };

        vm.removeFromPlayList = function(searchItem)
        {
            var index = vm.getIndex(searchItem);

            if(index >= 0 && searchItem.isExisted)
            {
                var deleteItem = new playlistitemsResource();
                deleteItem.id = searchItem.isExisted.id;
                playlistitemsResource.delete(deleteItem, function() {
                        vm.searchResult[index].isExisted = false;
                    },function()
                    {
                    }
                );
            }
        };

        var loadPlaylistItem = function(){
            playlistitemsResource.query({playlistId: vm.playlistId}, function (data) {
                for (var i = 0; i < data.items.length; i++) {
                    vm.playlist.push(data.items[i]);
                }
                searching();
            })
        };

        loadPlaylistItem();
    }
}());