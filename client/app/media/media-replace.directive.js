// FIXME: This controller is almost an exact duplicate of the Upload controller. (upload.js)
// FIXME: Find a way to encapsulate this logic into a single directive that can be reused in both places.

(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('hsMediaReplace', mediaReplaceDirective);

    function mediaReplaceDirective() {
        return {
            restrict: 'E',
            scope: {
                mediaId: '@'
            },
            templateUrl: 'app/media/media-replace.directive.html',
            controller: MediaReplaceController,
            controllerAs: 'vm'
        };
    }

    MediaReplaceController.$inject = ['$rootScope', '$scope', '$compile'];

    function MediaReplaceController($rootScope, $scope, $compile) {
        var vm = this;
        vm.mediaId = $scope.mediaId;
        vm.selectedFile = null;
        vm.invalidFile = null;
        vm.uploads = [];
        vm.isUploading = false;
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

        $scope.$watch('vm.selectedFile', initiateUploads);
        $rootScope.$on('mediaUploadCleared', function(event, args) { clearMediaUploadDirective(args.mediaId); });
        $rootScope.uploadProgressManager = new UploadProgress.Manager();

        function initiateUploads() {
            if (!vm.selectedFile) { return; }
            vm.uploads[vm.mediaId] = { file: vm.selectedFile };
            addMediaUploadDirective(vm.mediaId);
            vm.selectedFile = null;
        }

        function addMediaUploadDirective(mediaId) {
            // Compile and add the directive to the view
            var element = $compile('<hs-media-upload media-id="' + mediaId + '" include-media-form="false" is-replacing-media="true"></hs-media-upload>')($scope);
            vm.uploads[mediaId].element = element;
            $('#mediaUploadDirectives').prepend(element);

            // Display upload statistics
            vm.isUploading = numCurrentUploadDirectives() > 0;
        }

        function clearMediaUploadDirective(mediaId) {
            if (mediaId && vm.uploads[mediaId]) {
                vm.uploads[mediaId].element.remove();
                delete vm.uploads[mediaId];
            }
            vm.isUploading = numCurrentUploadDirectives() > 0;
        }

        function numCurrentUploadDirectives() {
            return Object.keys(vm.uploads).length;
        }
    }
})();
