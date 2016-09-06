(function() {
    'use strict';

    var STATIC_HOPESTREAM_MEDIA_URL = 'https://static.hopestream.com/media/';
    var STATIC_HOPESTREAM_PLAYER_URL = 'https://static.hopestream.com/player.html?id=';
    var HOPESTREAM_MEDIA_URL_TEST = 'https://hopestream-test.s3.amazonaws.com/media/'; // TEST URL
    var HOPESTREAM_MEDIA_URL_PROD = 'https://hopestream.s3.amazonaws.com/media/'; // PRODUCTION URL
    var MARKED_FOR_DELETION_STATUS = 5;
    var BYTES_PER_GIGABYTE = Math.pow(1024, 3);

    angular
        .module('app.media')
        .controller('Media', Media);

    Media.$inject = ['$rootScope', '$stateParams', '$timeout', 'toastr', 'State', 'Hash'];

    function Media($rootScope, $stateParams, $timeout, toastr, State, Hash) {
        var vm = this;
        var timeout = null;
        vm.state = State;
        vm.id = $stateParams.id;
        vm.hash = Hash.encode(parseInt($stateParams.id, 10));
        vm.media = undefined;

        vm.imageFileUrl = HOPESTREAM_MEDIA_URL_TEST + vm.hash + '/image.jpg?' + new Date().getTime();
        vm.shouldShowMediaImage = true;

        $rootScope.$on('mediaImageUploadCompleted', function(event, args) {
            // reload the image by adding a random query string parameter
            vm.imageFileUrl = vm.imageFileUrl.split('?')[0] + '?' + new Date().getTime();

            vm.shouldShowMediaImage = false;
            $timeout(function() { vm.shouldShowMediaImage = true; }, 0);
        });

        vm.videoPlayerUrl = STATIC_HOPESTREAM_PLAYER_URL + vm.hash;
        vm.videoURLs = [
            { label: 'Video ID', url: vm.hash },
            { label: 'Video Player', url: STATIC_HOPESTREAM_PLAYER_URL + vm.hash },
            { label: 'Video Stream', url: STATIC_HOPESTREAM_MEDIA_URL + vm.hash + '/master.m3u8' },
            { label: 'Video File', url: STATIC_HOPESTREAM_MEDIA_URL + vm.hash + '/video-default.mp4' }
        ];

        vm.copyToClipboardSuccess = function() {
            toastr.options.timeOut = 2000;
            toastr.options.extendedTimeOut = 1000;
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.info('<i class="fa fa-clipboard fa-lg"></i>&nbsp; Copied to clipboard');
        }

        vm.copyToClipboardError = function(error) {
            toastr.options.timeOut = 2000;
            toastr.options.extendedTimeOut = 1000;
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.error('<i class="fa fa-exclamation-triangle fa-lg"></i>&nbsp; Failed to copy to clipboard: ' + error);
        }

        $rootScope.$watch(function() { return State.mediaByID && State.mediaByID[vm.id]; }, function() {
            vm.media = State.mediaByID && State.mediaByID[vm.id];
        });
    };
})();
