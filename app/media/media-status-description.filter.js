(function() {
    'use strict';

    angular
        .module('app.media')
        .filter('mediaStatusDescription', mediaStatusDescriptionFilter);

    function mediaStatusDescriptionFilter() {
        return function(status) {
            switch(status) {
                case 0: return 'Your media is currently uploading.';
                case 1: return 'Your media will begin processing shortly.';
                case 2: return 'Your media is being processed for streaming and download.';
                case 3: return 'Your media is available for streaming and download.';
                case 4: return 'Please replace your media content in the Advanced section.';
                case -1: return 'Your media will use your provided URLs for streaming and download.';
                default: return '';
            }
        };
    }
})();
