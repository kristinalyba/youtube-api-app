/**
 * Created by k.lyba on 09.07.2015.
 */
(function () {
    "use strict";

    angular
        .module("ytApp")
        .controller("HomeController",["playlistResource","playlistitemsResource", HomeController]);

    function HomeController(playlistResource,playlistitemsResource) {
        var vm = this;
        vm.videos = [
            {name: "pupies"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}, {name: "kitties"}, {name: "parrots"}
        ];

/*
        var playerList = playlistResource.query(
            function()
            {
                console.log(playerList.items);
                var items = playerList.items;
                for(var item = 0; item < items.length; item++)
                {
                    var lists = playlistitemsResource.query({playlistId: items[item].id},function()
                    {
                        console.log(lists);
                    });
                }
            }
        );
*/

        vm.playlists = [
            {name: "Animals"}, {name: "Cars"}, {name: "Fails"}
        ];
    }
}());