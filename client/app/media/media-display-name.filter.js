(function() {
    'use strict';

    angular
        .module('app.media')
        .filter('mediaDisplayName', MediaDisplayNameFilter);

    MediaDisplayNameFilter.$inject = ['State'];

    function MediaDisplayNameFilter(State) {
        return function(media) {
            var name = media.name ? media.name : "Untitled";
            if (State.seriesByID && media.seriesId) {
                var series = State.seriesByID[media.seriesId];
                if (series) { return series.name + ' - ' + name; }
            }

            return name;
        };
    }
})();
