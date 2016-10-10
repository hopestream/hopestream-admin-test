(function() {
    'use strict';

    angular
        .module('app.series')
        .controller('SeriesList', SeriesList);

    SeriesList.$inject = ['$state', 'API', 'State', 'DTOptionsBuilder', 'DTColumnDefBuilder'];

    function SeriesList($state, API, State, DTOptionsBuilder, DTColumnDefBuilder) {
        var vm = this;
        vm.state = State;
        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withBootstrap()
            .withOption('lengthMenu', [[25, 50, 100, -1], [25, 50, 100, "All"]])
            .withOption('order', [[ 1, "asc" ]])
            .withDisplayLength(25);
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withOption('searchable', false),
            DTColumnDefBuilder.newColumnDef(0).withOption('width', '152px'),
        ];
        vm.addSeries = addSeries;

        function addSeries() {
            return API.createSeries()
                .then(function(result) {
                    var series = result.series[0];
                    State.series.push(series);
                    State.seriesByID[series.id] = series;

                    $state.go('series', { id: series.id });
                });
        }
    }
})();
