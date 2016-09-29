(function() {
    'use strict';

    angular
        .module('app.upload')
        .controller('Upload', Upload);

    Upload.$inject = ['$rootScope', '$scope', '$state', '$q', '$compile', 'API', 'State', 'Upload'];

    function Upload($rootScope, $scope, $state, $q, $compile, API, State, Upload) {
        var vm = this;
        vm.state = State;
        vm.selectedFiles = [];
        vm.invalidFiles = [];
        vm.uploads = [];
        vm.hasActiveUploads = false;
        vm.statsAverageSpeedMbps = 0;
        vm.statsPercentUploaded = 0;
        vm.statsTimeRemaining = 0;
        vm.acceptedFileTypes = '.3g2,.3gp,.4xm,.aac,.ac3,.act,.adf,.adp,.adx,.aea,.afc,.aiff,.alaw,.amr,.anm,.apc,' +
            '.ape,.aqtitle,.asf,.ass,.ast,.au,.avi,.avr,.avs,.bethsoftvid,.bfi,.bin,.bink,.bit,.bmv,.boa,.brstm,' +
            '.c93,.caf,.cavsvideo,.cdg,.cdxl,.concat,.data,.daud,.dfa,.dirac,.dnxhd,.dsicin,.dts,.dtshd,.dv,.dv1394,' +
            '.dxa,.ea,.eac3,.ea_cdata,.epaf,.f32be,.f32le,.f64be,.f64le,.fbdev,.ffm,.ffmetadata,.filmstrip,' +
            '.film_cpk,.flac,.flic,.flv,.frm,.g722,.g723_1,.g729,.gif,.gsm,.gxf,.h261,.h263,.h264,.hevc,.hls,' +
            '.applehttp,.hnm,.ico,.idcin,.idf,.iff,.ilbc,.image2,.image2pipe,.ingenient,.ipmovie,.ircam,.iss,.iv8,' +
            '.ivf,.jacosub,.jv,.latm,.lavfi,.lmlm4,.loas,.lvf,.lxf,.m4a,.m4v,.matroska,.webm,.mgsts,.microdvd,.mj2,' +
            '.mjpeg,.mlp,.mm,.mmf,.mov,.mp3,.mp4,.mpc,.mpc8,.mpeg,.mpegts,.mpegtsraw,.mpegvideo,.mpl2,.mpsub,' +
            '.msnwctcp,.mtv,.mulaw,.mv,.mvi,.mxf,.mxg,.nc,.nistsphere,.nsv,.nut,.nuv,.ogg,.oma,.oss,.paf,.pjs,.pmp,' +
            '.psxstr,.pva,.pvf,.qcp,.r3d,.rawvideo,.realtext,.redspark,.rl2,.rm,.roq,.rpl,.rsd,.rso,.rtp,.rtsp,.s8,' +
            '.s16be,.s16le,.s24be,.s24le,.s32be,.s32le,.sami,.sap,.sbg,.sdp,.shn,.siff,.smjpeg,.smk,.smush,.sol,.sox,' +
            '.spdif,.srt,.subviewer,.subviewer1,.swf,.tak,.tedcaptions,.thp,.tiertexseq,.tmv,.truehd,.tta,.tty,.txd,' +
            '.u8,.u16be,.u16le,.u24be,.u24le,.u32be,.u32le,.v4l2,.vc1,.vc1test,.video4linux2,.vivo,.vmd,.vobsub,.voc,' +
            '.vplayer,.vqf,.w64,.wav,.wc3movie,.webvtt,.wsaud,.wsvqa,.wtv,.wv,.xa,.xbin,.xmv,.xwma,.yop,.yuv4mpegpipe';

        $scope.$watch('vm.selectedFiles', initiateUploads);
        $scope.$watch('vm.hasActiveUploads', watchHasActiveUploads);
        $rootScope.$on('mediaUploadCleared', function(event, args) { clearMediaUploadDirective(args.mediaId); });
        $rootScope.uploadProgressManager = new UploadProgress.Manager();

        vm.createCustomMedia = function() {
            API.createMedia({ status: -1 })
                .then(function(result) {
                    var media = result.media[0];
                    State.media.push(media);
                    State.mediaByID[media.id] = media;
                    $state.go('media', { id: media.id });
                });
        }

        function initiateUploads() {
            if (!vm.selectedFiles || vm.selectedFiles.length == 0) { return; }

            angular.forEach(vm.selectedFiles, function(file) {
                createMediaEntry(file).then(addMediaUploadDirective);
            });

            vm.selectedFiles = [];
        }

        function createMediaEntry(file) {
            return API.createMedia()
                .then(function(result) {
                    var media = result.media[0];
                    State.media.push(media);
                    State.mediaByID[media.id] = media;
                    vm.uploads[media.id] = { file: file };
                    return media.id;
                });
        }

        function addMediaUploadDirective(mediaId) {
            // Compile and add the directive to the view
            var element = $compile('<hs-media-upload media-id="' + mediaId + '" include-media-form="true" is-replacing-media="false"></hs-media-upload>')($scope);
            vm.uploads[mediaId].element = element;
            $('#mediaUploadDirectives').prepend(element);

            // Display upload statistics
            vm.hasActiveUploads = numCurrentUploadDirectives() > 0;
        }

        function clearMediaUploadDirective(mediaId) {
            if (mediaId && vm.uploads[mediaId]) {
                vm.uploads[mediaId].element.remove();
                delete vm.uploads[mediaId];
            }
            vm.hasActiveUploads = numCurrentUploadDirectives() > 0;
        }

        function numCurrentUploadDirectives() {
            return Object.keys(vm.uploads).length;
        }

        function watchHasActiveUploads(newValue, oldValue) {
            if (oldValue === false && newValue === true) {
                displayActiveUploadsAlert();
            }
        }

        function displayActiveUploadsAlert() {
            toastr.options.timeOut = -1;
            toastr.options.extendedTimeOut = -1;
            toastr.options.positionClass = 'toast-bottom-right';
            toastr.info('<i class="fa fa-exclamation-triangle fa-lg"></i>&nbsp; <strong>Uploads In Progress.</strong>' +
                '<br>Do not leave this page or close your browser window until all uploads have finished. <small>(Tap to Dismiss)</small>');
        }
    }
})();
