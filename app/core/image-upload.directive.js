(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('hsImageUpload', imageUploadDirective);

    function imageUploadDirective() {
        return {
            restrict: 'E',
            scope: {
                feedId: '@',
                mediaId: '@',
                organizationId: '@',
                seriesId: '@',
                speakerId: '@'
            },
            templateUrl: 'app/core/image-upload.directive.html',
            controller: ImageUploadController,
            controllerAs: 'vm'
        };
    }

    ImageUploadController.$inject = ['$rootScope', '$scope', '$q', 'API', 'State'];

    function ImageUploadController($rootScope, $scope, $q, API, State) {
        var vm = this;

        vm.UPLOAD_STATUS_WAITING   = 0;
        vm.UPLOAD_STATUS_PREPARING = 1;
        vm.UPLOAD_STATUS_UPLOADING = 2;
        vm.UPLOAD_STATUS_ERROR     = 3;
        vm.UPLOAD_STATUS_COMPLETE  = 4;

        vm.file = null;
        vm.invalidFile = null;
        vm.upload = {};
        vm.loaded = 0;
        vm.total = 0;
        vm.progress = 0;
        vm.status = vm.UPLOAD_STATUS_WAITING;
        vm.selectFile = selectFile;
        vm.cancelUpload = cancelUpload;

        var manager = new UploadProgress.Manager();

        function selectFile(file, invalidFiles) {
            vm.file = null;
            vm.invalidFile = null;

            if (invalidFiles && invalidFiles[0]) { vm.invalidFile = invalidFiles[0]; return; }
            if (!file) { return; }

            var deferred = $q.defer();

            vm.file = file;
            vm.loaded = 0;
            vm.total = 0;
            vm.progress = 0;
            vm.status = vm.UPLOAD_STATUS_PREPARING;

            manager.removeUpload('A');
            manager.addUpload('A', new UploadProgress.Upload(new Date().getTime(), vm.loaded, vm.file.size));

            // Begin the file upload
            if ($scope.feedId) {
                vm.upload = API.uploadImageForFeed(State.feedsByID[$scope.feedId], vm.file);
            } else if ($scope.mediaId) {
                var object = State.mediaByID[$scope.mediaId];
                vm.upload = API.uploadImageForMedia(object, vm.file);
                vm.onSuccess = function(result) { var temp = result.media[0]; object.imageUrl = temp.imageUrl; object.thumbnailUrl = temp.thumbnailUrl; }
            } else if ($scope.organizationId) {
                var object = State.organization;
                vm.upload = API.uploadImageForOrganization(object, vm.file);
                vm.onSuccess = function(result) { var temp = result.organizations[0]; object.imageUrl = temp.imageUrl; object.thumbnailUrl = temp.thumbnailUrl; }
            } else if ($scope.seriesId) {
                var object = State.seriesByID[$scope.seriesId];
                vm.upload = API.uploadImageForSeries(object, vm.file);
                vm.onSuccess = function(result) { var temp = result.series[0]; object.imageUrl = temp.imageUrl; object.thumbnailUrl = temp.thumbnailUrl; }
            } else if ($scope.speakerId) {
                var object = State.speakersByID[$scope.speakerId];
                vm.upload = API.uploadImageForSpeaker(object, vm.file);
                vm.onSuccess = function(result) { var temp = result.speakers[0]; object.imageUrl = temp.imageUrl; object.thumbnailUrl = temp.thumbnailUrl; }
            }

            vm.upload.then(function(result) {
                vm.status = vm.UPLOAD_STATUS_COMPLETE;

                if (vm.onSuccess) { vm.onSuccess(result); }
                deferred.resolve();
                $rootScope.$broadcast('imageUploadCompleted');
            }, function(error) {
                if (error && error.status === -1) { // User cancelled the upload
                    vm.status = vm.UPLOAD_STATUS_WAITING;
                } else {
                    vm.status = vm.UPLOAD_STATUS_ERROR;
                }

                deferred.reject(error);
            }, function(event) {
                vm.status = vm.UPLOAD_STATUS_UPLOADING;
                vm.loaded = event.loaded;
                vm.total = event.total;

                manager.updateUpload('A', new Date().getTime(), vm.loaded);
                vm.progress = manager.getUpload('A').percentUploaded();
            });

            return deferred.promise;
        }

        function cancelUpload() {
            vm.upload.abort();
            vm.status = vm.UPLOAD_STATUS_WAITING;
        }
    }
})();
