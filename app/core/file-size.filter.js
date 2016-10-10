(function() {
    'use strict';

    angular
        .module('app.core')
        .filter('fileSize', fileSizeFilter);

    function fileSizeFilter() {
        return function(bytes, precision) {
            if (bytes === 0) {
                return '0 bytes';
            }

            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                return '---';
            }

            if (typeof precision === 'undefined') {
                precision = 1;
            }

            var units  = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024)),
                value  = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision);

            // Remove trailing zeros
            return (value.match(/\.0*$/) ? value.substr(0, value.indexOf('.')) : value) +  ' ' + units[number];
        };
    }
})();
