(function() {
    'use strict';

    angular
        .module('app.speakers')
        .directive('hsSpeakerForm', speakerFormDirective);

    function speakerFormDirective() {
        return {
            restrict: 'E',
            scope: {
                speakerId: '@'
            },
            templateUrl: 'app/speakers/speaker-form.directive.html',
            controller: SpeakerFormController,
            controllerAs: 'vm'
        };
    }

    SpeakerFormController.$inject = ['$scope', '$timeout', 'API', 'State'];

    function SpeakerFormController($scope, $timeout, API, State) {
        var vm = this;
        vm.state = State;
        vm.saving = false;
        vm.dirty = false;
        vm.speaker = angular.copy(State.speakersByID[$scope.speakerId]);

        vm.save = function() {
            if (vm.saving) { return; }
            vm.saving = true;
            vm.dirty = false;

            API.updateSpeaker(vm.speaker).then(function() {
                angular.copy(vm.speaker, State.speakersByID[vm.speaker.id]);
                completeSave(false);
            }, function() {
                completeSave(true);
            });
        };

        function completeSave(error) {
            if (error) { vm.dirty = true; }

            $timeout(function() {
                vm.saving = false;
                if (vm.dirty) { vm.save(); }
            }, error ? 2000 : 500);
        }

        var initializing = true;
        $scope.$watch('vm.speaker.name', formDidUpdate);
        $scope.$watch('vm.speaker.description', formDidUpdate);
        function formDidUpdate() {
            if (initializing) { $timeout(function() { initializing = false; }, 0); return; }
            vm.dirty = true;
        }
    }
})();
