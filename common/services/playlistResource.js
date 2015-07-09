/**
 * Created by a.ovsiannikov on 7/9/2015.
 */
(function(){
    "use strict";

    angular
        .module("common.services")
        .factory("playlistResource", ["$resource",playlistResource]);

    function playlistResource($resource){

        var getPlaylists = function()
        {
            return $resource("https://www.googleapis.com/youtube/v3/playlists",{ part:snippet});
        }

        return {
            getPlaylists: getPlaylists
        };
    }
}());



