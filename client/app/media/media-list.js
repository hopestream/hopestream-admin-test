(function() {
    'use strict';

    angular
        .module('app.media')
        .controller('MediaList', MediaList);

    MediaList.$inject = ['State', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function MediaList(State, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.state = State;
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('lengthMenu', [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]])
            .withOption('order', [[ 1, "desc" ]])
            .withDisplayLength(25);
        vm.dtColumnDefs = [
            // Sort column [0] (date) by invisible column [1] (utc timestamp)
            DTColumnDefBuilder.newColumnDef(0).withOption('orderData', [1]),
            DTColumnDefBuilder.newColumnDef(1).notVisible(),
            DTColumnDefBuilder.newColumnDef(1).withOption('searchable', false),

            // Column width percentages
            DTColumnDefBuilder.newColumnDef(0).withOption('width', '20%'),
            DTColumnDefBuilder.newColumnDef(2).withOption('width', '30%'),
            DTColumnDefBuilder.newColumnDef(3).withOption('width', '30%'),
            DTColumnDefBuilder.newColumnDef(4).withOption('width', '20%')
        ];
        vm.getMediaDisplayName = getMediaDisplayName;
        vm.getSpeakerNames = getSpeakerNames;

        function getMediaDisplayName(media) {
            var name = media.name ? media.name : "Untitled";
            if (State.seriesByID && media.seriesId) {
                var series = State.seriesByID[media.seriesId];
                if (series) { return series.name + ' - ' + name; }
            }

            return name;
        }

        function getSpeakerNames(media) {
            if (State.speakersByID && media.speakerIds) {
                var result = "";
                for (var i = 0; i < media.speakerIds.length; i++) {
                    var speakerID = media.speakerIds[i];
                    var speaker = State.speakersByID[speakerID];
                    if (speaker) {
                        if (result.length != 0) { result = result + '\n'; }
                        result = result + speaker.name;
                    }
                }

                if (result.length != 0) { return result; }
            }

            return "--";
        };
    }
})();
