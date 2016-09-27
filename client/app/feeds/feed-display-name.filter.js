(function() {
    'use strict';

    angular
        .module('app.feeds')
        .filter('feedDisplayName', FeedDisplayNameFilter);

    FeedDisplayNameFilter.$inject = [];

    function FeedDisplayNameFilter() {
        return function(feed) {
            var name = feed.title ? feed.title : "Untitled";

            switch(feed.type) {
                case 0: name = name + ' - Video Feed'; break;
                case 1: name = name + ' - Audio Feed'; break;
            }

            return name;
        };
    }
})();
