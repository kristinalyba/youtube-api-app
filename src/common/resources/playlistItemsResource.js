(function () {
    'use strict';

    angular
        .module('common.services')
        .factory('PlaylistItemsResource', ['$resource', PlaylistItemsResource]);

    function PlaylistItemsResource($resource) {
        return $resource(
            'https://www.googleapis.com/youtube/v3/playlistItems', null, {
                'get': {
                    method: 'GET',
                    params: {
                        id: '@id'
                    }
                },
                'save': {
                    method: 'POST',
                    params: {
                        part: 'snippet'
                    }
                },
                'query': {
                    method: 'GET',
                    params: {
                        part: 'snippet',
                        playlistId: '@playlistId',
                        mine: 'true',
                        maxResults: 50
                    }
                },
                'remove': {
                    method: 'DELETE'
                },
                'delete': {
                    method: 'DELETE'
                }
            }
        );
    }
}());
