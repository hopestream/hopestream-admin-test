(function() {
    'use strict';

    angular
        .module('app.media')
        .directive('hsMediaUrlForm', mediaURLFormDirective);

    function mediaURLFormDirective() {
        return {
            restrict: 'E',
            scope: {
                mediaId: '@'
            },
            templateUrl: 'app/media/media-url-form.directive.html',
            controller: MediaURLFormController,
            controllerAs: 'vm'
        };
    }

    MediaURLFormController.$inject = ['$scope', '$timeout', '$q', 'API', 'State'];

    function MediaURLFormController($scope, $timeout, $q, API, State) {
        var vm = this;
        vm.state = State;
        vm.saving = false;
        vm.dirty = false;
        vm.media = angular.copy(State.mediaByID[$scope.mediaId]);

        vm.save = function() {
            if (vm.saving) { return; }
            vm.saving = true;
            vm.dirty = false;

            API.updateMediaURLs(vm.media).then(function() {
                angular.copy(vm.media, State.mediaByID[vm.media.id]);
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
        $scope.$watch('vm.media.streamUrl', formDidUpdate);
        function formDidUpdate() {
            if (initializing) { $timeout(function() { initializing = false; }, 0); return; }
            vm.dirty = true;
        }
    }
})();
