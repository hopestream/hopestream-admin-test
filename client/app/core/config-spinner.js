(function() {
    'use strict';

    angular
        .module('app.core')
        .config(spinnerConfig);

    spinnerConfig.$inject = ['usSpinnerConfigProvider'];

    function spinnerConfig(usSpinnerConfigProvider) {
        usSpinnerConfigProvider.setDefaults({
            lines: 13 // The number of lines to draw
            , length: 28 // The length of each line
            , width: 4 // The line thickness
            , radius: 42 // The radius of the inner circle
            , scale: 0.5 // Scales overall size of the spinner
            , corners: 0 // Corner roundness (0..1)
            , color: '#000' // #rgb or #rrggbb or array of colors
            , opacity: 0.25 // Opacity of the lines
            , rotate: 0 // The rotation offset
            , direction: 1 // 1: clockwise, -1: counterclockwise
            , speed: 1 // Rounds per second
            , trail: 60 // Afterglow percentage
            , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            , zIndex: 2e9 // The z-index (defaults to 2000000000)
            , className: 'spinner' // The CSS class to assign to the spinner
            , top: '55px' // Top position relative to parent
            , left: '50%' // Left position relative to parent
            , shadow: false // Whether to render a shadow
            , hwaccel: false // Whether to use hardware acceleration
            , position: 'relative' // Element positioning
        });
    }
})();
