(function () {
    'use strict';

    angular
        .module('ytApp')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$q', '$scope', '$stateParams',
                                'playlistService', 'SearchResource'];

    function SearchController($q, $scope, $stateParams, playlistService, SearchResource) {
        var vm = this;
        vm.playlistService = playlistService;
        vm.searchResult = [];
        vm.searchText = $stateParams.searchText;

        var performSearch = function () {
            SearchResource.query({
                q: vm.searchText
            }, function (data) {
                vm.searchResult = filterYoutubeChannelsAndPlaylists(data.items);

                var promise = fillPlaylist();

                promise.then(function (playlistWithItems) {
                    if (!$scope.selectedPlaylist.items.length) {
                        $scope.selectedPlaylist.items = playlistWithItems.items;
                    }
                    vm.searchResult.forEach(function(item) {
                        item.alreadyInList = isVideoInList(item);
                    });
                });
            });
        };

        function fillPlaylist() {
            return $scope.selectedPlaylist.items.length ?
                                $q.when([]) :
                                playlistService.fillPlaylistItems($scope.selectedPlaylist);
        }

        function filterYoutubeChannelsAndPlaylists(items) {
            var arr = [];
            items.forEach(function(item) {
                if (item.id.kind === 'youtube#video') {
                    arr.push(item);
                }
            });
            return arr;
        }

        function isVideoInList(searchItem) {
            return playlistService.isItemInPlayList($scope.selectedPlaylist, searchItem.id.videoId);
        }

        vm.addToPlayList = function (searchItem) {
            if (!isVideoInList(searchItem)) {
                playlistService.addItemToPlaylist($scope.selectedPlaylist, searchItem)
                    .then(function () {
                        searchItem.alreadyInList = isVideoInList(searchItem);
                    });
            }
        };

        var itemIndexInPlaylist = function (searchItem) {
            return _.findIndex($scope.selectedPlaylist.items, function (item) {
                return item.snippet.resourceId.videoId === searchItem.id.videoId;
            });
        };

        vm.removeFromPlayList = function (searchItem) {
            var index = itemIndexInPlaylist(searchItem);

            if (index !== -1 && searchItem.alreadyInList) {
                playlistService.removeItemFromPlaylist($scope.selectedPlaylist,
                    $scope.selectedPlaylist.items[index]).then(
                    function videoRemovedFromPlaylist(data) {
                        searchItem.alreadyInList = isVideoInList(searchItem);
                    });
            }
        };

        playlistService.playlistsPromise.then(function () {
            performSearch();
        });
    }
}());
