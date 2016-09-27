(function() {
    'use strict';

    angular
        .module('app.feeds')
        .controller('Feed', Feed);

    Feed.$inject = ['$rootScope', '$stateParams', 'State', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function Feed($rootScope, $stateParams, State, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        var timeout = null;
        vm.state = State;
        vm.id = $stateParams.id;
        vm.feed = undefined;
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('lengthMenu', [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]])
            .withOption('order', [[ 1, "desc" ]])
            .withDisplayLength(5);
        vm.dtColumnDefs = [
            // Sort column [0] (date) by invisible column [1] (utc timestamp)
            DTColumnDefBuilder.newColumnDef(0).withOption('orderData', [1]),
            DTColumnDefBuilder.newColumnDef(1).notVisible(),
            DTColumnDefBuilder.newColumnDef(1).withOption('searchable', false),

            // Column width percentages
            DTColumnDefBuilder.newColumnDef(0).withOption('width', '20%'),
            DTColumnDefBuilder.newColumnDef(2).withOption('width', '30%'),
            DTColumnDefBuilder.newColumnDef(3).withOption('width', '30%'),
            DTColumnDefBuilder.newColumnDef(4).withOption('width', '20%')
        ];
        vm.deleteFeed = deleteFeed;

        $rootScope.$watch(function() { return State.feedsByID && State.feedsByID[vm.id]; }, function() {
            var previous = vm.feed;
            vm.feed = State.feedsByID && State.feedsByID[vm.id];
        });

        function deleteFeed() {
        }
    }
})();
