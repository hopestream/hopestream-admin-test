(function() {
    'use strict';

    angular
        .module('app.speakers')
        .controller('Speaker', Speaker);

    Speaker.$inject = ['$rootScope', '$stateParams', '$state', '$timeout', 'toastr', 'API', 'State', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function Speaker($rootScope, $stateParams, $state, $timeout, toastr, API, State, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        var timeout = null;
        vm.state = State;
        vm.id = $stateParams.id;
        vm.speaker = undefined;
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('lengthMenu', [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]])
            .withOption('order', [[ 1, "desc" ]])
            .withDisplayLength(5);
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

        $rootScope.$watch(function() { return State.speakersByID && State.speakersByID[vm.id]; }, function() {
            var previous = vm.speaker;
            vm.speaker = State.speakersByID && State.speakersByID[vm.id];

            if (vm.speaker && !previous) {
                updateImageURL();
            }
        });

        vm.imageUrl = undefined;
        vm.shouldShowImage = false;

        $rootScope.$on('imageUploadCompleted', updateImageURL);
        function updateImageURL() {
            vm.imageUrl = vm.speaker && vm.speaker.imageUrl + '?' + new Date().getTime();

            vm.shouldShowImage = false;
            $timeout(function() { vm.shouldShowImage = true; }, 0);
        }

        vm.deleteSpeaker = function() {
            API.deleteSpeaker(vm.speaker)
                .then(function() {
                    var index = -1;
                    for (var i = 0; i < State.speakers.length; i++) {
                        if (State.speakers[i].id == vm.id) { index = i; break; }
                    }
                    if (index >= 0) { State.speakers.splice(index, 1); }

                    delete State.speakersByID[vm.id];
                    $state.go('speaker-list');
                }, function(error) {
                    toastr.options.timeOut = 2000;
                    toastr.options.extendedTimeOut = 1000;
                    toastr.options.positionClass = 'toast-bottom-right';
                    toastr.error('<i class="fa fa-exclamation-triangle fa-lg"></i>&nbsp; Failed to delete speaker: ' + error);
                });
        };
    }
})();
