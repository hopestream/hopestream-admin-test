var HopeStream = HopeStream || {};

HopeStream.PLAYCOUNT_CHART_OPTIONS = {
    chart: {
        type: 'lineWithFocusChart',
        height: 600,
        margin : { top: 40, right: 40, bottom: 60, left: 40 },
        x: function(d) { return d[0]; },
        y: function(d) { return d[1]; },
        duration: 100,
        useInteractiveGuideline: true,
        xAxis: {
            axisLabel: 'Date',
            tickFormat: function(d) { return d3.time.format('%x')(new Date(d)); }
        },
        x2Axis: {
            tickFormat: function(d) { return d3.time.format('%x')(new Date(d)); }
        },
        yAxis: {
            axisLabel: 'Plays',
            tickFormat: function(d) { return d3.format(',f')(d); },
            rotateYLabel: false
        },
        y2Axis: {
            tickFormat: function(d) { return d3.format(',f')(d); }
        }

    }
};

HopeStream.BANDWIDTH_CHART_OPTIONS = {
    chart: {
        type: 'lineWithFocusChart',
        height: 600,
        margin : { top: 40, right: 40, bottom: 60, left: 40 },
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },
        duration: 100,
        useInteractiveGuideline: true,
        xAxis: {
            axisLabel: 'Date',
            tickFormat: function(d) { return d3.time.format('%x')(new Date(d)); }
        },
        x2Axis: {
            tickFormat: function(d) { return d3.time.format('%x')(new Date(d)); }
        },
        yAxis: {
            axisLabel: 'GB',
            tickFormat: function(d) { return d3.format(',.1f')(d); },
            rotateYLabel: false
        },
        y2Axis: {
            tickFormat: function(d) { return d3.format(',f')(d); }
        }

    }
};
