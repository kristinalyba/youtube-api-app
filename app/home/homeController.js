/**
 * Created by k.lyba on 09.07.2015.
 */
(function () {
    "use strict";

    angular
        .module("ytApp")
        .controller("HomeController", ["playlistResource", "playlistitemsResource", HomeController]);

    function HomeController(playlistResource, playlistitemsResource) {
        var vm = this;
        vm.playlists = [];
        vm.selectedPlaylistId = '';

        playlistResource.query(function (data) {
            for (var i = 0; i < data.items.length; i++) {
                vm.playlists.push(data.items[i]);
                vm.playlists[i].items = [];
            }
            if(vm.playlists.length){
                vm.setCurrentPlaylist(vm.playlists[0]);
            }
        });

        function fillPlaylistWithVideos(playlist) {
            playlistitemsResource.query({playlistId: playlist.id}, function (data) {
                for (var i = 0; i < data.items.length; i++) {
                    playlist.items.push(data.items[i]);
                }
            });
        }

        vm.getSpecificPlaylist = function (playlistId) {
            return _.find(vm.playlists, function (playlist, index, array) {
                    return playlist.id === playlistId;
                }
            );
        };

        vm.addToPlaylist = function () {
            //some logic
            alert("added");
        };

        vm.removeFromPlaylist = function () {
            //some logic
            alert("removed");
        };

        vm.isVideoInCurrentPlaylist = function () {
            return false;
        };

        vm.setCurrentPlaylist = function (playlist) {
            if (!vm.selectedPlaylistId || vm.selectedPlaylistId !== playlist.id) {
                vm.selectedPlaylistId = playlist.id;
            }
            if (playlist.items.length === 0) {
                fillPlaylistWithVideos(playlist);
            }
        }
    }
}());
