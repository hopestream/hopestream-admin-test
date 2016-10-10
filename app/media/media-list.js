(function() {
    'use strict';

    angular
        .module('app.media')
        .controller('MediaList', MediaList);

    MediaList.$inject = ['State', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function MediaList(State, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.state = State;
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('lengthMenu', [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "All"]])
            .withOption('order', [[ 1, "desc" ]])
            .withDisplayLength(25);
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
    }
})();
