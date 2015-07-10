/**
 * Created by k.lyba on 09.07.2015.
 */
(function () {
    "use strict";

    angular
        .module("ytApp")
        .controller("HomeController", ["playlistResource", HomeController]);

    function HomeController(playlistResource) {
        var vm = this;
        vm.playlists = [];
        vm.selectedPlayList = {};

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

        vm.videos = [
            {name: "pupies"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}
        ];

        vm.changePlayList = function(playlist){
            if(!vm.selectedPlayList || vm.selectedPlayList.id !== playlist.id){
                vm.selectedPlayList = playlist;
            }
        }

        playlistResource.query(function(data){
            for(var i = 0; i < data.items.length; i++){
                vm.playlists.push(data.items[i]);
            }
        });
    }
}());
