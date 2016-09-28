(function() {
    'use strict';

    angular
        .module('app.feeds')
        .controller('FeedList', FeedList);

    FeedList.$inject = ['$state', 'API', 'State', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function FeedList($state, API, State, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.state = State;
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('lengthMenu', [[25, 50, 100, -1], [25, 50, 100, "All"]])
            .withOption('order', [[ 1, "asc" ]])
            .withDisplayLength(25);
        vm.addFeed = addFeed;

        function addFeed() {
            return API.createFeed()
                .then(function(result) {
                    var feed = result.feeds[0];
                    feed.mediaIds = [];

                    State.feeds.push(feed);
                    State.feedsByID[feed.id] = feed;

                    $state.go('feed', { id: feed.id });
                });
        }
    }
})();
