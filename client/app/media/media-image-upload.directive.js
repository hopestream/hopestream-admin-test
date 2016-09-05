(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('hsMediaImageUpload', mediaImageUploadDirective);

    function mediaImageUploadDirective() {
        return {
            restrict: 'E',
            scope: {
                mediaId: '@'
            },
            templateUrl: 'app/media/media-image-upload.directive.html',
            controller: MediaImageUploadController,
            controllerAs: 'vm'
        };
    }

    MediaImageUploadController.$inject = ['$rootScope', '$scope', '$q', 'API', 'State'];

    function MediaImageUploadController($rootScope, $scope, $q, API, State) {
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
            vm.upload = API.uploadImageForMedia(State.mediaByID[$scope.mediaId], vm.file);
            vm.upload.then(function(response) {
                vm.status = vm.UPLOAD_STATUS_COMPLETE;

                deferred.resolve();
                $rootScope.$broadcast('mediaImageUploadCompleted', { hash: vm.hash });
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
