(function() {
    'use strict';

    angular
        .module('app.speakers')
        .controller('SpeakerList', SpeakerList);

    SpeakerList.$inject = ['$state', 'toastr', 'API', 'State', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function SpeakerList($state, toastr, API, State, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.state = State;
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('lengthMenu', [[10, 25, 50, -1], [10, 25, 50, "All"]])
            .withOption('order', [[ 1, "asc" ]])
            .withDisplayLength(10);
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withOption('searchable', false),
            DTColumnDefBuilder.newColumnDef(0).withOption('width', '152px')
        ];

        vm.createSpeaker = function(name, claim) {
            API.createSpeaker({ 'name': name })
                .then(function(result) {
                    var speaker = result.speakers[0];
                    State.speakers.push(speaker);
                    State.speakersByID[speaker.id] = speaker;

                    if (claim) {
                        vm.claimSpeaker(speaker);
                    } else {
                        toastr.options.timeOut = 2000;
                        toastr.options.extendedTimeOut = 1000;
                        toastr.options.positionClass = 'toast-bottom-right';
                        toastr.info('You\'ve created the speaker: ' + (speaker.name ? speaker.name : 'Untitled'));
                    }
                }, function(error) {
                    toastr.options.timeOut = 2000;
                    toastr.options.extendedTimeOut = 1000;
                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.error('<i class="fa fa-exclamation-triangle fa-lg"></i>&nbsp; Failed to create speaker: ' + error);
                });
        };

        vm.claimSpeaker = function(speaker) {
            API.claimSpeaker(speaker)
                .then(function() {
                    toastr.options.timeOut = 2000;
                    toastr.options.extendedTimeOut = 1000;
                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.info('You\'ve claimed the speaker: ' + (speaker.name ? speaker.name : 'Untitled') +
                        '. HopeStream will evaluate and respond to you shortly.');
                }, function(error) {
                    toastr.options.timeOut = 2000;
                    toastr.options.extendedTimeOut = 1000;
                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.error('<i class="fa fa-exclamation-triangle fa-lg"></i>&nbsp; Failed to claim speaker: ' + error);
                });
        };
    }
})();
