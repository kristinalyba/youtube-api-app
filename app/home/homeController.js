/**
 * Created by k.lyba on 09.07.2015.
 */
(function () {
    "use strict";

    angular
        .module("ytApp")
        .controller("HomeController", HomeController);

    function HomeController() {
        var vm = this;

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

        vm.playlists = [
            {name: "Animals"}, {name: "Cars"}, {name: "Fails"}
        ];
    }
}());