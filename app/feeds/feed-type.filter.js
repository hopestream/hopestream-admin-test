(function() {
    'use strict';

    angular
        .module('app.feeds')
        .filter('feedType', feedTypeFilter);

    function feedTypeFilter() {
        return function(type) {
            switch(type) {
                case 0: return 'Video Feed';
                case 1: return 'Audio Feed';
            }
        };
    }
})();
