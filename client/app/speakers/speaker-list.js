(function() {
    'use strict';

    angular
        .module('app.speakers')
        .controller('SpeakerList', SpeakerList);

    SpeakerList.$inject = ['$state', 'API', 'State', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function SpeakerList($state, API, State, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.state = State;
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('lengthMenu', [[25, 50, 100, -1], [25, 50, 100, "All"]])
            .withOption('order', [[ 1, "asc" ]])
            .withDisplayLength(25);
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withOption('searchable', false),
            DTColumnDefBuilder.newColumnDef(0).withOption('width', '152px'),
        ];
        vm.addSpeaker = addSpeaker;

        function addSpeaker() {
            return API.createSpeaker()
                .then(function(result) {
                    var speaker = result.speakers[0];
                    State.speakers.push(speaker);
                    State.speakersByID[speaker.id] = speaker;

                    $state.go('speaker', { id: speaker.id });
                });
        }
    }
})();
