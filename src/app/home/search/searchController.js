(function () {
    'use strict';

    angular
        .module('ytApp')
        .controller('SearchController', SearchController);

    SearchController.$inject = ['$q', '$stateParams',
                                'playlistService', 'SearchResource'];

    function SearchController($q, $stateParams, playlistService, SearchResource) {
        var vm = this;
        vm.playlistService = playlistService;
        vm.searchResult = [];
        vm.searchText = $stateParams.searchText;

        var performSearch = function () {
            SearchResource.query({
                q: vm.searchText
            }, function (data) {
                vm.searchResult = filterYoutubeChannelsAndPlaylists(data.items);
                if (playlistService.selectedPlaylist()) {
                    var promise = fillPlaylist();

                    promise.then(function (playlistWithItems) {
                        if (!playlistService.selectedPlaylist().items.length) {
                            playlistService.selectedPlaylist().items = playlistWithItems.items;
                        }
                        addAlreadyInPlaylistProp();
                    });
                } else {
                    if (playlistService.playlists.length) {
                        humane.log('Select a playlist first');
                    }
                }
            });
        };

        function fillPlaylist() { //TODO pub-sub fix necessary on no playlists
            return playlistService.selectedPlaylist().items.length ?
                $q.when([]) :
                playlistService.fillPlaylist(playlistService.selectedPlaylist());
        }

        function filterYoutubeChannelsAndPlaylists(items) {
            var arr = [];
            items.forEach(function (item) {
                if (item.id.kind === 'youtube#video') {
                    arr.push(item);
                }
            });
            return arr;
        }

        function onPlayListSelected() {
            if (vm.searchResult && _.any(vm.searchResult, function (item) {
                    return !item.alreadyInList;
                })) {
                addAlreadyInPlaylistProp();
            }
        }

        function addAlreadyInPlaylistProp() {
            vm.searchResult.forEach(function (item) {
                item.alreadyInList = alreadyInListBinder(item);
            });
        }

        function isVideoInList(searchItem) {
            return playlistService.isItemInPlayList(playlistService.selectedPlaylist(), searchItem.id.videoId);
        }

        vm.addToPlayList = function (searchItem) {
            if (!playlistService.selectedPlaylist()) {
                if (playlistService.playlists.length) {
                    humane.log('Select a playlist first');
                } else {
                    humane.log('For a start - add at least one playlist');
                }
            } else {
                onPlayListSelected(); //TODO move to pubsub when available
                if (!isVideoInList(searchItem)) {
                    playlistService.addItemToPlaylist(playlistService.selectedPlaylist(), searchItem.id.videoId);
                }
            }
        };

        function alreadyInListBinder(item) {
            return function () {
                return isVideoInList(item);
            };
        }

        var itemIndexInPlaylist = function (searchItem) {
            return _.findIndex(playlistService.selectedPlaylist().items, function (item) {
                return item.snippet.resourceId.videoId === searchItem.id.videoId;
            });
        };

        vm.removeFromPlayList = function (searchItem) {
            var index = itemIndexInPlaylist(searchItem);

            if (index !== -1 && searchItem.alreadyInList()) {
                playlistService.removeItemFromPlaylist(playlistService.selectedPlaylist(),
                    playlistService.selectedPlaylist().items[index]);
            }
        };

        playlistService.playlistsPromise.then(function () {
            performSearch();
        });
    }
}());
