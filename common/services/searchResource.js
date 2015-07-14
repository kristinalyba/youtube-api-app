/**
 * Created by a.ovsiannikov on 7/10/2015.
 */
(function(){
    "use strict";

    angular
        .module("common.services")
        .factory("searchResource", ["$resource",searchResource]);

    function searchResource($resource) {
        return $resource(
            "https://www.googleapis.com/youtube/v3/search",null
            ,
            {
                'query':  {method:'GET', params:{part: 'snippet', mine: 'true', maxResults : 50, q: '@q'}}
            }
        );
    }
}());



