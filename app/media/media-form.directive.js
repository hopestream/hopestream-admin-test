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

    MediaFormController.$inject = ['$scope', '$timeout', '$q', 'API', 'State'];

    function MediaFormController($scope, $timeout, $q, API, State) {
        var vm = this;
        vm.state = State;
        vm.saving = false;
        vm.dirty = false;
        vm.media = angular.copy(State.mediaByID[$scope.mediaId]);
        vm.feeds = State.feeds.filter(function(feed) { return feed.mediaIds.indexOf(vm.media.id) >= 0; });

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

        vm.setSeries = function(series) {
            vm.media.seriesId = series && series.id;
        };

        vm.addFeedWithID = function(id) {
            if (id > 0) {
                var insert = vm.feeds.length;
                for (var i = 0; i < vm.feeds.length; i++) {
                    var feed = vm.feeds[i];
                    if (feed.id === id) { insert = -1; break; }
                    if (feed.id > id) { insert = i; break; }
                }
                if (insert >= 0) {
                    vm.feeds.splice(insert, 0, vm.state.feedsByID[id]);
                }
            } else {
                vm.media.hidden = false;
            }
        }

        vm.removeFeedWithID = function(id) {
            if (id > 0) {
                var index = -1;
                for (var i = 0; i < vm.feeds.length; i++) {
                    var feed = vm.feeds[i];
                    if (feed.id === id) { index = i; break; }
                }
                if (index >= 0) { vm.feeds.splice(index, 1); }
            } else {
                vm.media.hidden = true;
            }
        }

        vm.addSpeaker = function(speaker) {
            if (vm.media.speakerIds.length >= 2 || vm.media.speakerIds.indexOf(speaker.id) >= 0) { return; }
            vm.media.speakerIds.push(speaker.id);
        }

        vm.removeSpeakerWithID = function(id) {
            var index = vm.media.speakerIds.indexOf(id);
            if (index >= 0) { vm.media.speakerIds.splice(index, 1); }
        }

        vm.topicColumns = [
            ['God\'s Creation', 'Fallen Mankind', 'God\'s Redemptive Plan', 'God', 'God\'s Church', 'Family', 'Audience'],
            ['Christian Living'],
            ['Old Testament Books', 'New Testament Books']];

        vm.addTopic = function(topic) {
            if (vm.media.topicIds.length >= 3 || vm.media.topicIds.indexOf(topic.id) >= 0) { return; }
            vm.media.topicIds.push(topic.id);
        }

        vm.removeTopicWithID = function(id) {
            var index = vm.media.topicIds.indexOf(id);
            if (index >= 0) { vm.media.topicIds.splice(index, 1); }
        }

        vm.save = function() {
            if (vm.saving) { return; }
            vm.saving = true;
            vm.dirty = false;

            var promises = [];

            vm.media.date = vm.datetimePicker.date;
            promises.push(API.updateMedia(vm.media).then(function() {
                angular.copy(vm.media, State.mediaByID[vm.media.id]);
            }));

            var current = vm.feeds.map(function(feed) { return feed.id; });
            var previous = State.feeds.filter(function(feed) { return feed.mediaIds.indexOf(vm.media.id) >= 0; }).map(function(feed) { return feed.id; });

            var remove = previous.filter(function(id) { return current.indexOf(id) < 0; });
            for (var i = 0; i < remove.length; i++) {
                (function() {
                    var feed = State.feedsByID[remove[i]];
                    promises.push(API.removeMediaIDForFeed(feed, vm.media.id).then(function() {
                        var index = feed.mediaIds.indexOf(vm.media.id);
                        if (index >= 0) { feed.mediaIds.splice(index, 1); }
                    }))
                })();
            }

            var add = current.filter(function(id) { return previous.indexOf(id) < 0; });
            for (var i = 0; i < add.length; i++) {
                (function() {
                    var feed = State.feedsByID[add[i]];
                    promises.push(API.addMediaIDForFeed(feed, vm.media.id).then(function() {
                        var index = feed.mediaIds.indexOf(vm.media.id);
                        if (index < 0) { feed.mediaIds.push(vm.media.id); }
                    }))
                })();
            }

            $q.all(promises).then(function() { completeSave(false); }, function() { completeSave(true); });
        };

        function completeSave(error) {
            if (error) { vm.dirty = true; }

            $timeout(function() {
                vm.saving = false;
                if (vm.dirty) { vm.save(); }
            }, error ? 2000 : 500);
        }

        var initializing = true;
        $scope.$watch('vm.media.name', formDidUpdate);
        $scope.$watch('vm.media.description', formDidUpdate);
        $scope.$watch('vm.media.hidden', formDidUpdate);
        $scope.$watch('vm.media.seriesId', formDidUpdate);
        $scope.$watch('vm.media.speakerIds.length', formDidUpdate);
        $scope.$watch('vm.media.topicIds.length', formDidUpdate);
        $scope.$watch('vm.datetimePicker.date', formDidUpdate);
        $scope.$watch('vm.feeds.length', formDidUpdate);
        function formDidUpdate() {
            if (initializing) { $timeout(function() { initializing = false; }, 0); return; }
            vm.dirty = true;
        }
    }
})();
