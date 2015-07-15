(function () {
    "use strict";

    angular
        .module("ytApp")
        .controller("HomeController", ["playlistService", "playlistitemsResource", "$state", HomeController]);

    function HomeController(playlistService, playlistitemsResource, $state) {
        var vm = this;
        vm.playlistService = playlistService;
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

        playlistService.playlistsPromise.then(function(){
            if (vm.playlistService.playlists.length) {
                vm.setCurrentPlaylist(vm.playlistService.playlists[0]);
            }
        });

        vm.getSpecificPlaylist = function (playlistId) {
            return _.find(vm.playlistService.playlists, function (playlist) {
                    return playlist.id === playlistId;
                }
            );
        };

        vm.addToPlaylist = function () {
            var newItem = {id: vm.selectedPlaylistItem.videoId};
            var playList = vm.getSpecificPlaylist(vm.selectedPlaylistId);

            playlistService.addItemToPlaylist(playList, newItem);
        };

        vm.removeFromPlaylist = function (item) {
            var itemToDelete = {id: item? item.id : vm.selectedPlaylistItem.id};
            var playList = vm.getSpecificPlaylist(vm.selectedPlaylistId);

            playlistService.removeItemFromPlaylist(playList, item);
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
                    playlistService.fillPlaylistItems(playlist)
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
                vm.selectedPlaylistItem.src = 'https://www.youtube.com/embed/' + playlistItem.snippet.resourceId.videoId + '?list=' + playlistItem.snippet.playlistId;// + '&autoplay=true';
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
