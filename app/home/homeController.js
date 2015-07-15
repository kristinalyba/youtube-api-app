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
        vm.isVideoInCurrentPlaylist = true;
        vm.searchtext='';

        vm.getSearchResult = function()
        {
            if(vm.searchtext !== '')
            {
                $state.go('home.search',{selectedPlaylistId: vm.selectedPlaylistId, searchtext: vm.searchtext});
            }

        };

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
            return _.find(vm.playlists, function (playlist) {
                    return playlist.id === playlistId;
                }
            );
        };

        var reloadPlayListItem = function()
        {
            if(vm.selectedPlaylistId !== '')
            {
                var currentPlayListItem = vm.getSpecificPlaylist(vm.selectedPlaylistId);
                if(currentPlayListItem)
                {
                    vm.selectedPlaylistId='';
                    currentPlayListItem.items=[];
                    vm.setCurrentPlaylist(currentPlayListItem);
                }
            }
        };

        vm.addToPlaylist = function () {
            var newitem = new playlistitemsResource();
            newitem.snippet = {};
            newitem.snippet.playlistId = vm.selectedPlaylistId;
            newitem.snippet.resourceId = { kind: "youtube#video" ,videoId: vm.selectedPlaylistItem.videoId};

            playlistitemsResource.save(newitem, function() {
                    reloadPlayListItem();
                },function()
                {
                }
            );
        };

        vm.removeFromPlaylist = function (item) {
            var deleteItem = new playlistitemsResource();
            deleteItem.id = item? item.id : vm.selectedPlaylistItem.id;
            playlistitemsResource.delete(deleteItem, function() {
                    reloadPlayListItem();
                },function()
                {
                }
            );

        };

        var checkIsVideoInCurrentPlaylist = function () {
            var result = true;
            var currentPlayListItem = vm.getSpecificPlaylist(vm.selectedPlaylistId);
            if(currentPlayListItem)
            {

                result = _.findIndex(currentPlayListItem.items, function (item) {
                    return item.id === vm.selectedPlaylistItem.id;
                }) >= 0 ;
            }
            vm.isVideoInCurrentPlaylist = result;
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
            if(playlistItem)
            {
                vm.selectedPlaylistItem.title = playlistItem.snippet.title;
                vm.selectedPlaylistItem.src = 'https://www.youtube.com/embed/' + playlistItem.snippet.resourceId.videoId + '?list=' + playlistItem.snippet.playlistId;
                vm.selectedPlaylistItem.videoId = playlistItem.snippet.resourceId.videoId;
                vm.selectedPlaylistItem.id = playlistItem.id;
            }
            else
            {
                vm.selectedPlaylistItem.title = 'video not found';
                vm.selectedPlaylistItem.src = '';
                vm.selectedPlaylistItem.videoId = '';
                vm.selectedPlaylistItem.id = '';
            }
            checkIsVideoInCurrentPlaylist();
        };

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
