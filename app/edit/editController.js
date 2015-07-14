(function(){
    "use strict";
    angular.module("ytApp").controller("EditController", ["playlistResource", EditController]);

    function EditController(playlistResource){
        var vm = this;
        vm.newPlaylist = { snippet: {title: "", description: ""}, addMode: false};

        vm.addNewPlaylistAccept = function(){
            addNewPlaylist(vm.newPlaylist);
            vm.toggleAddPlaylist();
            loadPlaylists();
        };

        vm.addNewPlaylistReject = function(){
            vm.toggleAddPlaylist();
        };

        vm.removePlaylist = function(playlist){
            removePlaylist(playlist);
            loadPlaylists();
        };

        vm.toggleAddPlaylist = function(){
            if(!vm.newPlaylist.addMode){
                vm.newPlaylist.snippet.title = "";
                vm.newPlaylist.snippet.description = "";
                vm.newPlaylist.addMode = true;
            } else {
                vm.newPlaylist.addMode = false;
            }
        };

        vm.togglePlaylistEdit = function(playlist){
            if(!playlist.editMode){
                playlist.snippet.tempTitle = playlist.snippet.title;
                playlist.snippet.tempDescription = playlist.snippet.description;
                playlist.editMode = true;
            } else {
                playlist.editMode = false;
            }
        };

        vm.playlistChangesAccept = function(playlist){
            playlist.snippet.description = playlist.snippet.tempDescription;
            playlist.snippet.title = playlist.snippet.tempTitle;
            updatePlaylist(playlist);
            vm.togglePlaylistEdit(playlist);
        };

        vm.playlistChangesReject = function(playlist){
            playlist.snippet.tempTitle = playlist.snippet.title;
            playlist.snippet.tempDescription = playlist.snippet.description;
            vm.togglePlaylistEdit(playlist);
        };

        var loadPlaylists = function(){
            playlistResource.query(function playlistsLoadedCallback(data){
                vm.playlists = data;
            });
        };

        var addNewPlaylist = function(playlist){
            var newitem = new playlistResource();
            newitem.snippet = playlist.snippet;

            playlistResource.save(newitem, function(data) {
                loadPlaylists();
            },function(data){
                // oops!
            });
        };

        var removePlaylist = function(playlist)
        {
            if(!confirm('Are you sure you want to remove playlist?'))
                return;

            var newitem = new playlistResource();
            newitem.id = playlist.id;

            playlistResource.delete(newitem, function(data) {
                loadPlaylists();
            },function(data){
                // oops!
            });
        };

        var updatePlaylist = function(playlist){
            var newitem = new playlistResource();
            newitem.id = playlist.id;
            newitem.snippet = playlist.snippet;

            playlistResource.update(newitem, function(data) {
                loadPlaylists();
            },function(data){
                // oops!
            });
        };

        loadPlaylists();
    };
}());
