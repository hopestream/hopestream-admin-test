(function() {
    'use strict';

    angular
        .module('app.media')
        .directive('hsMediaForm', mediaFormDirective);

    function mediaFormDirective() {
        return {
            restrict: 'E',
            scope: {
                mediaId: '@'
            },
            templateUrl: 'app/media/media-form.directive.html',
            controller: MediaFormController,
            controllerAs: 'vm'
        };
    }

    MediaFormController.$inject = ['$scope', 'State'];

    function MediaFormController($scope, State) {
        var vm = this;
        vm.state = State;
        vm.dirty = false;
        vm.saving = false;
        vm.media = angular.copy(State.mediaByID[$scope.mediaId]);
        vm.feeds = undefined;
        vm.datetimePicker = {
            date: vm.media.date,
            isOpen: false,
            format: 'M/dd/yyyy h:mm a',
            datePicker: { showWeeks: false },
            open: function(event) {
                event.preventDefault();
                event.stopPropagation();
                vm.datetimePicker.isOpen = true;
            },
            buttonBar: {
                show: true,
                now:   { show: true,  text: 'Now'   },
                today: { show: true,  text: 'Today' },
                clear: { show: false, text: 'Clear' },
                date:  { show: true,  text: 'Date'  },
                time:  { show: true,  text: 'Time'  },
                close: { show: false, text: 'Close' }
            }
        };

        $scope.$watch('vm.media.name', formDidUpdate);
        $scope.$watch('vm.datetimePicker.date', formDidUpdate);
        function formDidUpdate() { vm.dirty = true; }

        function saveChanges() {
        }
    }
})();
