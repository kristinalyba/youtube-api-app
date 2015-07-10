/**
 * Created by a.ovsiannikov on 7/9/2015.
 */
(function(){
    "use strict";

    angular
        .module("common.services")
        .factory("playlistResource", ["$resource",playlistResource]);

    function playlistResource($resource) {
        return $resource(
                "https://developers.google.com/youtube/v3/docs/channels",null
                ,
                {
                    'get':    {method:'GET',params:{id:'@id'}},
                    'save':   {method:'POST'},
                    'query':  {method:'GET', params:{mine: 'true', part: 'contentDetails'}, isArray:true, withCredentials:true},
                    'remove': {method:'DELETE'},
                    'delete': {method:'DELETE'}
                }
        );
    }
}());



