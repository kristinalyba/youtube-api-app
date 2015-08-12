(function () {
    angular
        .module('ytApp')
        .service('playlistService', playlistService);

    playlistService.$inject = ['PlaylistResource', 'PlaylistItemsResource', 'PubSub'];

    function playlistService(PlaylistResource, PlaylistItemsResource, PubSub) {
        var svc = this;
        var selectedPlaylistitem = null;
        var selectedPlaylist = null;

        svc.playlists = [];

        svc.selectedPlaylistitem = function () {
            return selectedPlaylistitem;
        };

        svc.selectedPlaylist = function () {
            return selectedPlaylist;
        };

        svc.selectPlaylist = function (playlist) {
            if (playlist === null) {
                svc.selectPlaylistitem(null);
            } else if (!playlist.items.length) {
                fillPlaylistAndSelectFirstItem(playlist);
            }

            selectedPlaylist = playlist;
            PubSub.publish('playlist.selected', playlist);
        };

        svc.selectPlaylistitem = function (video) {
            if (video !== null && !video.src) {
                video.src = 'https://www.youtube.com/embed/' +
                    video.snippet.resourceId.videoId +
                    '?list=' + video.snippet.playlistId;
            }

            selectedPlaylistitem = video;
            PubSub.publish('playlistitem.selected');
        };

        svc.playlistsPromise = PlaylistResource.query(function playlistsLoadedCallback(data) {
            svc.playlists = data.items;
            for (var i = 0; i < svc.playlists.length; i++) {
                svc.playlists[i].items = [];
            }
            if (svc.playlists.length) {
                svc.selectPlaylist(svc.playlists[0]);
            }
            PubSub.publish('playlists.loaded', svc.playlists);
        }).$promise;

        svc.addPlaylist = function (playlist) {
            var newitem = new PlaylistResource({
                snippet: playlist.snippet
            });
            return PlaylistResource.save(newitem).$promise
                .then(function playlistAdded(data) {
                    data.items = [];
                    svc.playlists.splice(0, 0, data);
                    PubSub.publish('playlist.added', data);
                }, function playlistNotAdded(data) {
                    humane.log('Error adding playlist');
                    console.log(data);
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
                    if (playlist === selectedPlaylist) {
                        selectAnotherPlaylist(indx);
                    }
                    PubSub.publish('playlist.removed', playlist);
                }, function playlistNotRemoved(data) {
                    humane.log('Error deleting playlist');
                    console.log(data);
                });
        };

        svc.updatePlaylist = function (playlist) {
            var updatingItem = new PlaylistResource({
                id: playlist.id,
                snippet: playlist.snippet
            });

            return PlaylistResource.update(updatingItem, function (data) {
                PubSub.publish('playlist.updated', data);
            }, function (data) {
                humane.log('Error updating playlist');
                console.log(data);
            }).$promise;
        };

        svc.addItemToPlaylist = function (playlist, videoId) {
            var newitem = new PlaylistItemsResource({
                snippet: {
                    playlistId: playlist.id,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId: videoId
                    }
                }
            });

            return PlaylistItemsResource.save(newitem, function itemAddedToPlaylist(data) {
                var indx = _.indexOf(svc.playlists, playlist);
                if (indx !== -1) {
                    svc.playlists[indx].items.splice(0, 0, data);
                }
                PubSub.publish('playlistitem.added', data);
            }, function itemNotAddedToPlaylist(data) {
                humane.log('Error adding item to playlist');
                console.log(data);
            }).$promise;
        };

        svc.removeItemFromPlaylist = function (playlist, item) {
            var deleteItem = new PlaylistItemsResource({
                id: item.id
            });

            return PlaylistItemsResource.delete(deleteItem, function itemRemovedFromPlaylist(data) {
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
                PubSub.publish('playlistitem.removed', {
                    playlist: playlist,
                    item: item
                });
            }, function itemNotRemovedFromPlaylist(data) {
                humane.log('Error removing item from playlist');
                console.log(data);
            }).$promise;
        };

        svc.fillPlaylistItems = function (playlist) {
            return PlaylistItemsResource.query({
                playlistId: playlist.id
            }, function (data) {
                var indx = getPlaylistIndex(playlist);
                svc.playlists[indx].items = data.items;
                PubSub.publish('playlist.filled', playlist);
            }, function (data) {
                humane.log('Error filling the playlist');
                console.log(data);
            }).$promise;
        };

        svc.isItemInPlayList = function (playlist, videoId) {
            return _.any(playlist.items, function (item) {
                return item.snippet.resourceId.videoId === videoId;
            });
        };

        function fillPlaylistAndSelectFirstItem(playlist) {
            svc.fillPlaylistItems(playlist)
                .then(function () {
                    if (playlist.items.length) {
                        svc.selectPlaylistitem(playlist.items[0]);
                    }
                });
        }

        function selectAnotherPlaylist(indx) {
            while (!svc.playlists[indx] && indx >= 0) {
                indx--;
            }

            svc.selectPlaylist(indx >= 0 ? svc.playlists[indx] : null);
        }

        var getPlaylistIndex = function (searchItem) {
            return _.findIndex(svc.playlists, function (playlist) {
                return playlist.id === searchItem.id;
            });
        };
    }
}());
