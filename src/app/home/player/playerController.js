(function () {
    'use strict';

    angular
        .module('ytApp')
        .controller('PlayerController', ['PubSub', PlayerController]);

    function PlayerController(PubSub) {
        var vm = this;

        vm.data = 'yoyo';

        PubSub.subscribe('someData', function (data) {
            vm.data = data;
        })

    }
}());
