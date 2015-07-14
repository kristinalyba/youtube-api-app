/**
 * Created by k.lyba on 09.07.2015.
 */
(function () {
    "use strict";

    angular
        .module("ytApp")
        .controller("HomeController", ["playlistResource", "playlistitemsResource", "$state", HomeController]);

    function HomeController(playlistResource,playlistitemsResource, $state) {
        var vm = this;
        vm.playlists = [];
        vm.selectedPlaylistId = '';
        vm.selectedPlaylistItem = {};

        playlistResource.query(function (data) {
            for (var i = 0; i < data.items.length; i++) {
                vm.playlists.push(data.items[i]);
                vm.playlists[i].items = [];
            }
            if (vm.playlists.length) {
                vm.setCurrentPlaylist(vm.playlists[0]);
            }
        });

        function fillPlaylistWithVideos(playlist) {
            return playlistitemsResource.query({playlistId: playlist.id}, function (data) {
                for (var i = 0; i < data.items.length; i++) {
                    playlist.items.push(data.items[i]);
                }
            }).$promise;

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
                if(!playlist.items.length){
                    fillPlaylistWithVideos(playlist)
                        .then(function () {
                            if(playlist.items.length)
                                vm.setCurrentPlaylistItem(playlist.items[0]);
                        }
                    );
                } else {
                    vm.setCurrentPlaylistItem(playlist.items[0]);
                }
            }
        };

        vm.setCurrentPlaylistItem = function(playlistItem){
            vm.selectedPlaylistItem.title = playlistItem.snippet.title;
            vm.selectedPlaylistItem.src = 'https://www.youtube.com/embed/' + playlistItem.snippet.resourceId.videoId + '?list=' + playlistItem.snippet.playlistId;// + '&autoplay=true';
        }
        vm.currentView = function(){
            return $state.current.name;
        };
        
        var prevView;

        vm.toggleEdit = function(){
            if(isEditMode()){
                $state.go(!prevView || prevView == 'home.edit' ? 'home.player' : prevView);
            }
            else{
                prevView = vm.currentView();
                $state.go('home.edit');
            }
        };

        var isEditMode = function(){
            return vm.currentView() == 'home.edit';
        };
    }
}());
