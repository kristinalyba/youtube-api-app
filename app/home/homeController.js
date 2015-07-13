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
        vm.selectedPlayList = {};
        vm.videos = [];

        vm.addToPlaylist = function(){
            //some logic
            alert("added");
        }

        vm.removeFromPlaylist = function(){
            //some logic
            alert("removed");
        }

        vm.isVideoInCurrentPlaylist = function(){
            return false;
        }

                vm.changePlayList = function(playlist){
            if(!vm.selectedPlayList || vm.selectedPlayList.id !== playlist.id){
                vm.selectedPlayList = playlist;
            }
        };

        vm.currentView = function(){
            return $state.current.name;
        };

        playlistResource.query(function(data){
            for(var i = 0; i < data.items.length; i++){
                vm.playlists.push(data.items[i]);
            }
        });

        vm.toggleEdit = function(){
            if(isEditMode()){
                $state.go(prevView == 'home.edit' ? 'home.player' : prevView);
            }
            else{
                prevView = vm.currentView();
                $state.go('home.edit');
            }
        };

        var prevView;

        var isEditMode = function(){
            return vm.currentView == 'home.edit';
        };


    }
}());
