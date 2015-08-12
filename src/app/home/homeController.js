(function () {
    'use strict';

    angular
        .module('ytApp')
        .controller('HomeController', ['$window', '$scope', 'playlistService', '$state', HomeController]);

    function HomeController($window, $scope, playlistService, $state) {
        var vm = this;
        vm.playlistService = playlistService;
        vm.searchText = '';

        vm.getSearchResult = function () {
            if (vm.searchText !== '') {
                $state.go('home.search', {
                    searchText: vm.searchText
                });
            }
        };

        playlistService.playlistsPromise.then(function () {
            if (vm.playlistService.playlists.length) {
                vm.setCurrentPlaylist(playlistService.playlists[0]);
            } else {
                humane.log('For a start - add at least one playlist');
            }
        }, function (data) {
            if (isNoChannelError(data.data.error)) {
                humane.log('You don\'t have a YouTube channel! Click here to create.', {
                    timeout: 0,
                    clickToClose: true,
                    addnCls: 'humane-flatty-error'
                }, function () {
                    $window.open('https://www.youtube.com/create_channel');
                });
            }
        });

        function isNoChannelError(error) {
            return error.code === 404 && _.any(error.errors, function (err) {
                return err.location === 'channelId' && err.reason === 'channelNotFound';
            });
        }

        vm.addToPlaylist = function () {
            var videoId = playlistService.selectedPlaylistitem().snippet.resourceId.videoId;

            playlistService.addItemToPlaylist(playlistService.selectedPlaylist(), videoId)
                .then(function () {
                    vm.setCurrentPlaylistItem(playlistService.selectedPlaylist().items[0]);
                });
        };

        vm.removeFromPlaylist = function (item) {
            var itemToDelete = {
                id: item ? item.id : playlistService.selectedPlaylistitem().id
            };

            playlistService.removeItemFromPlaylist(playlistService.selectedPlaylist(), itemToDelete);
        };

        vm.checkIsVideoInCurrentPlaylist = function () {
            var selectedPl = playlistService.selectedPlaylist();
            var selectedPlItem = playlistService.selectedPlaylistitem();
            if (selectedPl && selectedPlItem) {
                return playlistService.isItemInPlayList(selectedPl, selectedPlItem.snippet.resourceId.videoId);
            }
        };

        vm.setCurrentPlaylist = function (playlist) {
            playlistService.selectPlaylist(playlist);
        };

        vm.setCurrentPlaylistItem = function (playlistItem) {
            playlistService.selectPlaylistitem(playlistItem);
        };

        vm.currentView = function () {
            return $state.current.name;
        };

        var prevView = null;

        vm.toggleEdit = function () {
            if (vm.isEditMode()) {
                $state.go(!prevView || prevView === 'home.edit' ? 'home.player' : prevView);
            } else {
                prevView = vm.currentView();
                $state.go('home.edit');
            }
        };

        vm.isEditMode = function () {
            return vm.currentView() === 'home.edit';
        };
    }
}());
