(function() {
    'use strict';

    angular
        .module('app.media')
        .directive('hsMediaStatus', mediaStatusDirective);

    function mediaStatusDirective() {
        return {
            restrict: 'E',
            scope: {
                status: '@'
            },
            templateUrl: 'app/media/media-status.directive.html',
            controller: MediaStatusController,
            controllerAs: 'vm'
        };
    }

    MediaStatusController.$inject = ['$scope'];

    function MediaStatusController($scope) {

        var status = parseInt($scope.status);

        var vm = this;
        vm.class = getClass(status);
        vm.icon = getIcon(status);
        vm.text = getText(status);

        function getClass(status) {
            switch(status) {
                case 0: return 'hs-media-status-warning';
                case 1: return 'hs-media-status-info';
                case 2: return 'hs-media-status-info';
                case 3: return 'hs-media-status-success';
                case 4: return 'hs-media-status-danger';
                case 5: return 'hs-media-status-danger';
                case 6: return 'hs-media-status-danger';
                case -1: return 'hs-media-status-success';
                default: return 'hs-media-status-warning';
            }
        }

        function getIcon(status) {
            switch(status) {
                case 0: return 'fa-exclamation-triangle';
                case 1: return 'fa-info-circle';
                case 2: return 'fa-info-circle';
                case 3: return 'fa-check-circle';
                case 4: return 'fa-exclamation-circle';
                case 5: return 'fa-exclamation-circle';
                case 6: return 'fa-exclamation-circle';
                case -1: return 'fa-check-circle';
                default: return 'fa-question-circle';
            }
        }

        function getText(status) {
            switch(status) {
                case 0: return 'Uploading';
                case 1: return 'Uploaded';
                case 2: return 'Processing';
                case 3: return 'Available';
                case 4: return 'Error';
                case 5: return 'Deleted By User';
                case 6: return 'Deleted';
                case -1: return 'Custom';
                default: return 'Unknown';
            }
        }
    }

})();
