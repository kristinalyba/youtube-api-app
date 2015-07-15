(function(){
    angular.module("ytApp").service("playlistService", ["playlistResource", "playlistitemsResource", playlistService]);

    function playlistService(playlistResource, playlistitemsResource){
        var svc = this;

        svc.playlists = [];

        function loadPlaylists(){
            playlistResource.query(function playlistsLoadedCallback(data){
                svc.playlists = data;
            });
        }
        loadPlaylists();

        svc.addPlaylist = function (playlist) {
            var newitem = new playlistResource();
            newitem.snippet = playlist.snippet;

            return playlistResource.save(newitem).$promise
                .then(function playlistAdded(data){
                var newPlaylist = data;
                svc.playlists.items.splice(0,0,newPlaylist);
            }, function playlistNotAdded(data){

            });
        };

        svc.removePlaylist = function (playlist) {
            if(!confirm('Are you sure you want to remove playlist?'))
                return;

            var deletingItem = new playlistResource();
            deletingItem.id = playlist.id;

            return playlistResource.delete(deletingItem).$promise
                .then(function playlistRemoved(data){
                var indx = _.indexOf(svc.playlists.items, playlist);
                if(indx!== -1) svc.playlists.items.splice(indx,1)
            }, function playlistNotRemoved(data){

            });
        }

        svc.updatePlaylist = function (playlist) {
            var updatingItem = new playlistResource();
            updatingItem.id = playlist.id;
            updatingItem.snippet = playlist.snippet;

            return playlistResource.update(updatingItem).$promise;
        };
    };
}());
