(function () {
    angular
        .module('ytApp')
        .service('playlistService', ['PlaylistResource', 'PlaylistItemsResource', playlistService]);

    function playlistService(PlaylistResource, PlaylistItemsResource) {
        var svc = this;

        svc.playlists = [];
        svc.playlistsPromise = null;

        function loadPlaylists() {
            svc.playlistsPromise = PlaylistResource.query(function playlistsLoadedCallback(data) {
                svc.playlists = data.items;
                for (var i = 0; i < svc.playlists.length; i++) {
                    svc.playlists[i].items = [];
                }
            }).$promise;
        }
        loadPlaylists();

        svc.addPlaylist = function (playlist) {
            var newitem = new PlaylistResource({
                snippet: playlist.snippet
            });
            return PlaylistResource.save(newitem).$promise
                .then(function playlistAdded(data) {
                    data.items = [];
                    svc.playlists.splice(0, 0, data);
                }, function playlistNotAdded(data) {

                });
        };

        svc.removePlaylist = function (playlist) {
            if (!confirm('Are you sure you want to remove playlist?')) {
                return;
            }
            var deletingItem = new PlaylistResource({
                id: playlist.id
            });

            return PlaylistResource.delete(deletingItem).$promise
                .then(function playlistRemoved(data) {
                    var indx = _.indexOf(svc.playlists, playlist);
                    if (indx !== -1) {
                        svc.playlists.splice(indx, 1);
                    }
                }, function playlistNotRemoved(data) {

                });
        };

        svc.updatePlaylist = function (playlist) {
            var updatingItem = new PlaylistResource({
                id: playlist.id,
                snippet: playlist.snippet
            });

            return PlaylistResource.update(updatingItem).$promise;
        };

        svc.addItemToPlaylist = function (playlist, item) {
            var newitem = new PlaylistItemsResource({
                snippet: {
                    playlistId: playlist.id,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId: item.id.videoId
                    }
                }
            });

            return PlaylistItemsResource.save(newitem, function itemAddedToPlaylist(data) {
                var indx = _.indexOf(svc.playlists, playlist);
                if (indx !== -1) {
                    svc.playlists[indx].items.splice(0, 0, data);
                }
            }, function itemNotAddedToPlaylist(data) {

            }).$promise;
        };

        svc.removeItemFromPlaylist = function (playlist, item) {
            var deleteItem = new PlaylistItemsResource({
                id: item.id
            });

            return PlaylistItemsResource.delete(deleteItem, function itemRemovedFromPlaylist() {
                var playlistIndx = _.indexOf(svc.playlists, playlist);
                if (playlistIndx !== -1) {
                    var itemIndx = _.findIndex(svc.playlists[playlistIndx].items,
                        function (playlistItem) {
                            return playlistItem.id === deleteItem.id;
                        });
                    if (itemIndx !== -1) {
                        svc.playlists[playlistIndx].items.splice(itemIndx, 1);
                    }
                }
            }, function itemNotRemovedFromPlaylist(data) {

            }).$promise;
        };

        svc.fillPlaylistItems = function (playlist) {
            return PlaylistItemsResource.query({
                playlistId: playlist.id
            }, function (data) {
                var indx = getPlaylistIndex(playlist);
                svc.playlists[indx].items = data.items;
            }).$promise;
        };

        var getPlaylistIndex = function (searchItem) {
            return _.findIndex(svc.playlists, function (playlist) {
                return playlist.id === searchItem.id;
            });
        };
    }
}());
