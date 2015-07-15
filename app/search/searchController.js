(function(){
    "use strict";

    angular
        .module("ytApp")
        .controller("SearchController", ["$q", "playlistService", "$scope", "searchResource", "$stateParams", SearchController]);

    function SearchController($q, playlistService, $scope, searchResource, $stateParams){
        var vm = this;
        vm.playlistService = playlistService;
        vm.searchResult =[];
        vm.searchText = $stateParams.searchText;
        var playlist = {};

        var performSearch = function(){
            searchResource.query({q: vm.searchText}, function (data) {
                vm.searchResult = data.items;
                var prms = playlist.items.length ? $q.when([]) : playlistService.fillPlaylistItems(playlist);
                prms.then(function(playlistWithItems){
                    if(!playlist.items.length)
                        playlist = playlistWithItems;
                    for (var i = 0; i < vm.searchResult.length; i++) {
                        vm.searchResult[i].alreadyInList = isVideoInList(vm.searchResult[i]);
                    }
                });
            }
        )};

        function isVideoInList(searchItem){
            return $.map(playlist.items, function(item){
                return item.snippet.resourceId.videoId === searchItem.id.videoId ? 1 : null;
            }).length > 0;
        }

        vm.addToPlayList = function(searchItem){
            var index = itemIndexInPlaylist(searchItem);

            if(index === -1){
                playlistService.addItemToPlaylist(playlist, searchItem)
                    .then(function(){
                    searchItem.alreadyInList = isVideoInList(searchItem);
                });
            }
        };

        var itemIndexInPlaylist = function(searchItem){
            return _.findIndex(playlist.items, function (item) {
                return item.snippet.resourceId.videoId === searchItem.id.videoId;
            });
        };

        vm.removeFromPlayList = function(searchItem){
            var index = itemIndexInPlaylist(searchItem);

            if(index !== -1 && searchItem.alreadyInList){
                playlistService.removeItemFromPlaylist(playlist, playlist.items[index])
                    .then(function videoRemovedFromPlaylist(data){
                    searchItem.alreadyInList = isVideoInList(searchItem);
                });
            }
        };

        playlistService.playlistsPromise.then(function(){
            playlist = $scope.selectedPlaylist;
            performSearch();
        });
    }
}());
