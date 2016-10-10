(function() {
    'use strict';

    angular
        .module('app.feeds')
        .directive('hsFeedForm', feedFormDirective);

    function feedFormDirective() {
        return {
            restrict: 'E',
            scope: {
                feedId: '@'
            },
            templateUrl: 'app/feeds/feed-form.directive.html',
            controller: FeedFormController,
            controllerAs: 'vm'
        };
    }

    FeedFormController.$inject = ['$scope', '$timeout', 'API', 'State'];

    function FeedFormController($scope, $timeout, API, State) {
        var vm = this;
        vm.state = State;
        vm.saving = false;
        vm.dirty = false;
        vm.feed = angular.copy(State.feedsByID[$scope.feedId]);

        vm.feedTypes = [
            {id: 0, name: 'Video Feed'},
            {id: 1, name: 'Audio Feed'}
        ];

        vm.save = function() {
            if (vm.saving) { return; }
            vm.saving = true;
            vm.dirty = false;

            API.updateFeed(vm.feed).then(function() {
                angular.copy(vm.feed, State.feedsByID[vm.feed.id]);
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
        $scope.$watch('vm.feed.title', formDidUpdate);
        $scope.$watch('vm.feed.type', formDidUpdate);
        $scope.$watch('vm.feed.subtitle', formDidUpdate);
        $scope.$watch('vm.feed.description', formDidUpdate);
        $scope.$watch('vm.feed.url', formDidUpdate);
        $scope.$watch('vm.feed.email', formDidUpdate);
        $scope.$watch('vm.feed.copyright', formDidUpdate);
        $scope.$watch('vm.feed.category', formDidUpdate);
        $scope.$watch('vm.feed.keywords', formDidUpdate);
        function formDidUpdate() {
            if (initializing) { $timeout(function() { initializing = false; }, 0); return; }
            vm.dirty = true;
        }
    }
})();
