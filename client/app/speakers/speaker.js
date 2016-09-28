(function() {
    'use strict';

    angular
        .module('app.speakers')
        .controller('Speaker', Speaker);

    Speaker.$inject = ['$rootScope', '$stateParams', '$state', '$timeout', 'toastr', 'API', 'State', 'Hash', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function Speaker($rootScope, $stateParams, $state, $timeout, toastr, API, State, Hash, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        var timeout = null;
        vm.state = State;
        vm.id = $stateParams.id;
        vm.hash = Hash.encode(parseInt($stateParams.id, 10));
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

        vm.imageUrl = HopeStream.S3_URL + 'speaker/' + vm.hash + '/image.jpg?' + new Date().getTime();
        vm.shouldShowImage = true;

        $rootScope.$on('imageUploadCompleted', function(event, args) {
            // reload the image by adding a random query string parameter
            vm.imageUrl = vm.imageUrl.split('?')[0] + '?' + new Date().getTime();

            vm.shouldShowImage = false;
            $timeout(function() { vm.shouldShowImage = true; }, 0);
        });

        $rootScope.$watch(function() { return State.speakersByID && State.speakersByID[vm.id]; }, function() {
            vm.speaker = State.speakersByID && State.speakersByID[vm.id];
        });

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