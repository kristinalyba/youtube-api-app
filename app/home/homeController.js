/**
 * Created by k.lyba on 09.07.2015.
 */
(function () {
    "use strict";

    angular
        .module("ytApp")
        .controller("HomeController",["playlistResource","playlistitemsResource", "$state", HomeController]);

    function HomeController(playlistResource,playlistitemsResource, $state) {
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
                if(!vm.firstVideoLoaded && data.items.length > 0)
                {
                    var item = data.items[0].snippet;
                    vm.srcVideo = 'https://www.youtube.com/embed/' + item.resourceId.videoId +  '?list=' + item.playlistId;// + '&autoplay=true';
                    vm.firstVideoLoaded = true;
                }
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
        };

        vm.currentView = function(){
            return $state.current.name;
        };
        
        var prevView;
        vm.toggleEdit = function(){
            if(isEditMode()){
                $state.go(prevView == 'home.edit' ? 'home.player' : prevView);
            }
            else{
                prevView = vm.currentView();
                $state.go('home.edit');
            }
        };

        

        var isEditMode = function(){
            return vm.currentView == 'home.edit';
        };
    }
}());
