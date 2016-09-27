(function() {
    'use strict';

    angular
        .module('app.feeds')
        .directive('hsFeedForm', feedFormDirective);

    function feedFormDirective() {
        return {
            restrict: 'E',
            scope: {
                hash: '@'
            },
            templateUrl: 'app/feeds/feed-form.directive.html',
            controller: FeedFormController,
            controllerAs: 'vm'
        };
    }

    FeedFormController.$inject = ['$rootScope', '$scope', '$timeout', 'Feed', 'hashService'];

    function FeedFormController($rootScope, $scope, $timeout, Feed, hashService) {
        var vm = this;
        var timeout = null;
        vm.feed = {};
        vm.isSavingChanges = false;
        vm.isLoading = false;
        vm.feedTypes = [
            {id: '0', name: 'Video Feed'},
            {id: '1', name: 'Audio Feed'}
        ];
        vm.selectedFeedType;

        initialize();

        function initialize() {
            vm.isLoading = true;

            var id = hashService.decode($scope.hash); // FIXME: Remove this when we start using hashes

            Feed.findById({
                id: id
            }, function(feed) {
                vm.feed = feed;
                vm.selectedFeedType = vm.feedTypes[parseInt(vm.feed.type)];
                $scope.$watch('vm.feed.title', debounceSaveChanges);
                $scope.$watch('vm.selectedFeedType', debounceSaveChanges);
                $scope.$watch('vm.feed.subtitle', debounceSaveChanges);
                $scope.$watch('vm.feed.description', debounceSaveChanges);
                $scope.$watch('vm.feed.url', debounceSaveChanges);
                $scope.$watch('vm.feed.email', debounceSaveChanges);
                $scope.$watch('vm.feed.copyright', debounceSaveChanges);
                $scope.$watch('vm.feed.category', debounceSaveChanges);
                $scope.$watch('vm.feed.keywords', debounceSaveChanges);
                vm.isLoading = false;
            }, function(error) {
                console.log(error);
            });
        }

        function debounceSaveChanges(newValue, oldValue) {
            if (newValue != oldValue) {
                if (timeout) { $timeout.cancel(timeout); }
                timeout = $timeout(saveChanges, 2000);
            }
        }

        function saveChanges() {
            var NOW = new Date();

            vm.isSavingChanges = true;
            vm.feed.type = vm.selectedFeedType.id;
            vm.feed.lastUpdated = NOW;
            vm.feed.$save(function(feed) {
                $rootScope.$broadcast('feedDetailsChanged', vm.feed);
                vm.isSavingChanges = false;
            }, function(error) {
                console.log(error);
                vm.isSavingChanges = false;
            });
        }

        function deleteFeed() {

            // FIXME: 500ms timeout is a hack.
            // FIXME: Figure out why modal isn't fully dismissing.
            $timeout(function() {

                Feed.deleteById({
                    id: vm.feed.id
                }, function(response) {
                    // Feed deleted successfully

                    // Delete all feedMedia relationships for this feed
                    // FIXME: Use promises to do this in the correct sequence

                    FeedMedia.find({
                        filter: {
                            where: {
                                feedId: vm.feed.id
                            }
                        }
                    }, function(feedMedias) {

                        for (var i = 0; i < feedMedias.length; i++) {
                            var feedMedia = feedMedias[i];

                            FeedMedia.deleteById({
                                id: feedMedia.id
                            }, function(response) {
                                // No operation
                            }, function(error) {
                                console.log(error);
                            });
                        }

                    }, function(error) {
                        console.log(error);
                    });

                }, function(error) {
                    console.log(error);
                });

                $state.go('feeds');

            }, 500);
        }
    }
})();
