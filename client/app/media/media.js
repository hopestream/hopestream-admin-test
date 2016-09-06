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

    Media.$inject = ['$rootScope', '$stateParams', '$timeout', 'toastr', 'API', 'State', 'Hash', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function Media($rootScope, $stateParams, $timeout, toastr, API, State, Hash, DTOptionsBuilder, DTColumnDefBuilder) {
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

        $rootScope.$watch(function() { return State.mediaByID && State.mediaByID[vm.id]; }, function() {
            var previous = vm.media;
            vm.media = State.mediaByID && State.mediaByID[vm.id];

            if (vm.media && !previous) {
                updateVideoURLs();
                updateAudioURLs();
                updateUsageStatistics();
            }
        });

        var updateVideoURLs = function() {
            vm.videoPlayerUrl = STATIC_HOPESTREAM_PLAYER_URL + vm.hash;
            vm.videoURLs = [
                { label: 'Video ID', url: vm.hash },
                { label: 'Video Player', url: STATIC_HOPESTREAM_PLAYER_URL + vm.hash },
                { label: 'Video Stream', url: STATIC_HOPESTREAM_MEDIA_URL + vm.hash + '/master.m3u8' },
                { label: 'Video File', url: STATIC_HOPESTREAM_MEDIA_URL + vm.hash + '/video-default.mp4' }
            ];
        };

        var updateAudioURLs = function() {
            vm.audioURLs = [];
            if (vm.media.type && vm.media.type == 1) {
                vm.audioURLs.push({ label: 'Audio ID', url: vm.hash });
                vm.audioURLs.push({ label: 'Audio Stream (Recommended)', url: STATIC_HOPESTREAM_MEDIA_URL + vm.hash + '/master.m3u8' });
            }
            vm.audioURLs.push({ label: 'Audio File', url: STATIC_HOPESTREAM_MEDIA_URL + vm.hash + '/audio.mp3' });

            vm.audioPlayerOptions = {
                file: (vm.media.type == 1) ?
                    STATIC_HOPESTREAM_MEDIA_URL + vm.hash + '/master.m3u8' :
                    STATIC_HOPESTREAM_MEDIA_URL + vm.hash + '/audio.mp3',
                aspectratio: "0",
                height: "33"
            }
        }

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

        vm.playcountData = [];
        vm.playcountChartOptions = HopeStream.PLAYCOUNT_CHART_OPTIONS;
        vm.bandwidthData = [];
        vm.bandwidthChartOptions = HopeStream.BANDWIDTH_CHART_OPTIONS;
        vm.usageTotals = { bandwidth: 0, playcountAudio: 0, playcountVideo: 0, playcountHLS: 0 };

        function updateUsageStatistics() {
            API.getUsageForMedia(vm.media)
                .then(function(usage) {
                    vm.usageData = usage;

                    vm.playcountData = [
                        { key: 'Audio Plays', values: [] },
                        { key: 'Video Plays', values: [] },
                        { key: 'HLS Plays', values: [] }];

                    vm.bandwidthData = [
                        { key: 'Bandwidth (GB)', values: [] }];

                    for (var i = 0; i < usage.length; i++) {
                        var data = usage[i];

                        // Trim the time portion of the date: 2015-09-02T04:00:00.000Z -> 2015-09-02
                        var trimmed = new Date(data[0]).toISOString().substring(0, 10);
                        var date = new Date(trimmed).getTime() + (12 * 60 * 60 * 1000);  // Add 12 hours so the actual date is correct
                        data.date = date;

                        vm.playcountData[0].values.push([ date, data[2] ]);
                        vm.playcountData[1].values.push([ date, data[3] ]);
                        vm.playcountData[2].values.push([ date, data[4] ]);
                        vm.bandwidthData[0].values.push([ date, data[1] / BYTES_PER_GIGABYTE ]);

                        vm.usageTotals.bandwidth      += data[1];
                        vm.usageTotals.playcountAudio += data[2];
                        vm.usageTotals.playcountVideo += data[3];
                        vm.usageTotals.playcountHLS   += data[4];
                    }

                    vm.isUsageLoading = false;
                })
        }

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('lengthMenu', [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]])
            .withOption('order', [[ 1, "desc" ]])
            .withDisplayLength(5);

        vm.dtColumnDefs = [
            // Sort first column [0] (date) by the invisible second column [1] (utc timestamp)
            DTColumnDefBuilder.newColumnDef(0).withOption('orderData', [1]),
            DTColumnDefBuilder.newColumnDef(1).notVisible(),
            DTColumnDefBuilder.newColumnDef(1).withOption('searchable', false),

            // Sort third column [2] (bandwidth) by the invisible fourth column [3] (bytes)
            DTColumnDefBuilder.newColumnDef(2).withOption('orderData', [3]),
            DTColumnDefBuilder.newColumnDef(3).notVisible(),
            DTColumnDefBuilder.newColumnDef(3).withOption('searchable', false),

            // Column width percentages
            DTColumnDefBuilder.newColumnDef(0).withOption('width', '28%'),
            DTColumnDefBuilder.newColumnDef(2).withOption('width', '18%'),
            DTColumnDefBuilder.newColumnDef(3).withOption('width', '18%'),
            DTColumnDefBuilder.newColumnDef(4).withOption('width', '18%'),
            DTColumnDefBuilder.newColumnDef(5).withOption('width', '18%')
        ];
    };
})();
