(function() {
    'use strict';

    angular
        .module('app.organization')
        .controller('Organization', Organization);

    Organization.$inject = ['$rootScope', '$scope', '$timeout', 'API', 'State', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function Organization($rootScope, $scope, $timeout, API, State, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.state = State;
        vm.organization = undefined;

        $scope.$watch(function() { return State.organization; }, function() {
            var previous = vm.organization;
            vm.organization = angular.copy(State.organization);

            if (vm.organization && !previous) {
                updateImageURL();
                updateUsageStatistics();
            }
        });

        vm.imageUrl = undefined;
        vm.shouldShowImage = false;

        $rootScope.$on('imageUploadCompleted', updateImageURL);
        function updateImageURL() {
            vm.imageUrl = vm.organization && vm.organization.imageUrl + '?' + new Date().getTime();

            vm.shouldShowImage = false;
            $timeout(function() { vm.shouldShowImage = true; }, 0);
        }

        vm.playcountData = [];
        vm.playcountChartOptions = HopeStream.PLAYCOUNT_CHART_OPTIONS;
        vm.bandwidthData = [];
        vm.bandwidthChartOptions = HopeStream.BANDWIDTH_CHART_OPTIONS;
        vm.usageTotals = { bandwidth: 0, playcountAudio: 0, playcountVideo: 0, playcountHLS: 0 };

        function updateUsageStatistics() {
            API.getUsageForOrganization(vm.organization)
                .then(function(usage) {
                    vm.usageData = usage;

                    vm.playcountData = [
                        { key: 'Audio Plays', values: [] },
                        { key: 'Video Plays', values: [] },
                        { key: 'HLS Plays', values: [] }];

                    vm.bandwidthData = [
                        { key: 'Bandwidth (GB)', values: [] }];

                    var length = usage && usage.length;
                    for (var i = 0; i < length; i++) {
                        var data = usage[i];

                        // Trim the time portion of the date: 2015-09-02T04:00:00.000Z -> 2015-09-02
                        var trimmed = new Date(data[0]).toISOString().substring(0, 10);
                        var date = new Date(trimmed).getTime() + (12 * 60 * 60 * 1000);  // Add 12 hours so the actual date is correct
                        data.date = date;

                        vm.playcountData[0].values.push([ date, data[2] ]);
                        vm.playcountData[1].values.push([ date, data[3] ]);
                        vm.playcountData[2].values.push([ date, data[4] ]);
                        vm.bandwidthData[0].values.push([ date, data[1] / HopeStream.BYTES_PER_GIGABYTE ]);

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
    }
})();
