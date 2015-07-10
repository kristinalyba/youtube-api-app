(function(){
    "use strict";

    angular
        .module("common.services")
        .factory("playlistResource", ["$resource",playlistResource]);

    function playlistResource($resource) {
        return $resource(
                "https://content.googleapis.com/youtube/v3/playlists",null
                ,
                {
                    'get':    {method:'GET',params:{id:'@id'}},
                    'save':   {method:'POST'},
                    'query':  {method:'GET', params:{part: 'snippet', mine: 'true'}, withCredentials:true},
                    'remove': {method:'DELETE'},
                    'delete': {method:'DELETE'}
                }
        );
    }
}());
