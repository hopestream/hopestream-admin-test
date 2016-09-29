(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('hsMediaUpload', mediaUploadDirective);

    function mediaUploadDirective() {
        return {
            restrict: 'E',
            scope: {
                mediaId: '@',
                includeMediaForm: '@',
                isReplacingMedia: '@'
            },
            templateUrl: 'app/media/media-upload.directive.html',
            controller: MediaUploadController,
            controllerAs: 'vm'
        };
    }

    MediaUploadController.$inject = ['$rootScope', '$scope', '$q', 'API', 'State', 'Upload'];

    function MediaUploadController($rootScope, $scope, $q, API, State, Upload) {
        var vm = this;

        vm.UPLOAD_STATUS_WAITING   = 0;
        vm.UPLOAD_STATUS_UPLOADING = 1;
        vm.UPLOAD_STATUS_ERROR     = 2;
        vm.UPLOAD_STATUS_COMPLETE  = 3;

        vm.mediaId = $scope.mediaId;
        vm.media = State.mediaByID[vm.mediaId];
        vm.includeMediaForm = $scope.includeMediaForm === 'true';
        vm.isReplacingMedia = $scope.isReplacingMedia === 'true';
        vm.file = $scope.$parent.vm.uploads[vm.mediaId].file;
        vm.upload = {};
        vm.status = vm.UPLOAD_STATUS_WAITING;
        vm.loaded = 0;
        vm.total = 0;
        vm.progress = 0;
        vm.isCollapsed = false;

        vm.cancelUpload = cancelUpload;
        vm.clearUpload = clearUpload;

        API.getUploadPolicyForMedia(State.mediaByID[vm.mediaId], vm.file.type)
            .then(function(policy) { return uploadFile(policy); })
            .then(function() { return API.updateMediaStatus(vm.media, 1); })
            .then(function() { vm.media.status = 1; })
            .then(completeUpload);

        function uploadFile(policy) {
            var deferred = $q.defer();

            // Add an upload entity to the Upload Progress Manager
            $rootScope.uploadProgressManager.addUpload(vm.mediaId, new UploadProgress.Upload(new Date().getTime(), vm.loaded, vm.file.size));

            // Begin the file upload
            var upload = Upload.upload({
                url: policy.url,
                method: 'POST',
                data: {
                    key: policy.key,
                    AWSAccessKeyId: policy.accessKeyId,
                    acl: policy.acl,
                    policy: policy.policy,
                    signature: policy.signature,
                    "Content-Type": vm.file.type,
                    file: vm.file
                }
            });

            upload.then(function(response) {
                vm.status = vm.UPLOAD_STATUS_COMPLETE;
                vm.progress = 100;
                $rootScope.uploadProgressManager.removeUpload(vm.mediaId);
                deferred.resolve();
            }, function(error) {
                vm.status = vm.UPLOAD_STATUS_ERROR;
                $rootScope.uploadProgressManager.removeUpload(vm.mediaId);
                deferred.reject(error);
            }, function(event) {
                vm.status = vm.UPLOAD_STATUS_UPLOADING;
                vm.loaded = event.loaded;
                vm.total = event.total;
                $rootScope.uploadProgressManager.updateUpload(vm.mediaId, new Date().getTime(), vm.loaded);
                vm.progress = $rootScope.uploadProgressManager.getUpload(vm.mediaId).percentUploaded();
                uploadProgress();
            });

            vm.upload = upload;

            return deferred.promise;
        }

        function cancelUpload() {
            vm.upload.abort();
            $rootScope.uploadProgressManager.removeUpload(vm.mediaId);
            clearUpload();

            // If we are in the Media details page, and we are replacing media, hitting cancel SHOULD NOT delete the media entry
            // If we are in the Upload page, and we are uploading a brand new media, hitting cancel SHOULD delete the media entry
            if (!vm.isReplacingMedia) {
                API.deleteMedia(vm.media)
                    .then(function() {
                        var index = -1;
                        for (var i = 0; i < State.media.length; i++) {
                            if (State.media[i].id == vm.media.id) { index = i; break; }
                        }
                        if (index >= 0) { State.media.splice(index, 1); }

                        delete State.mediaByID[vm.id];
                    });
            }
        }

        function uploadProgress() {
            $rootScope.$broadcast('mediaUploadProgress', { mediaId: vm.mediaId });
        }

        function clearUpload() {
            $rootScope.$broadcast('mediaUploadCleared', { mediaId: vm.mediaId });
        }

        function completeUpload() {
            $rootScope.$broadcast('mediaUploadCompleted', { mediaId: vm.mediaId });
        }
    }

})();
