(function() {
    'use strict';

    angular
        .module('app.series')
        .directive('hsSeriesForm', seriesFormDirective);

    function seriesFormDirective() {
        return {
            restrict: 'E',
            scope: {
                seriesId: '@'
            },
            templateUrl: 'app/series/series-form.directive.html',
            controller: SeriesFormController,
            controllerAs: 'vm'
        };
    }

    SeriesFormController.$inject = ['$scope', '$timeout', 'API', 'State'];

    function SeriesFormController($scope, $timeout, API, State) {
        var vm = this;
        vm.state = State;
        vm.saving = false;
        vm.dirty = false;
        vm.series = angular.copy(State.seriesByID[$scope.seriesId]);

        vm.save = function() {
            if (vm.saving) { return; }
            vm.saving = true;
            vm.dirty = false;

            API.updateSeries(vm.series).then(function() {
                angular.copy(vm.series, State.seriesByID[vm.series.id]);
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
        $scope.$watch('vm.series.name', formDidUpdate);
        $scope.$watch('vm.series.description', formDidUpdate);
        function formDidUpdate() {
            if (initializing) { $timeout(function() { initializing = false; }, 0); return; }
            vm.dirty = true;
        }
    }
})();
