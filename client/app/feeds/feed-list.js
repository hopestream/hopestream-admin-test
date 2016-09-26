(function() {
    'use strict';

    angular
        .module('app.feeds')
        .controller('FeedList', FeedList);

    FeedList.$inject = ['State', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function FeedList(State, DTOptionsBuilder, authService) {
        var vm = this;
        vm.state = State;
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('lengthMenu', [[25, 50, 100, -1], [25, 50, 100, "All"]])
            .withOption('order', [[ 1, "asc" ]])
            .withDisplayLength(25);
        vm.addFeed = addFeed;

        function addFeed() {

        }
    }
})();
