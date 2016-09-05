(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('hsMediaImage', mediaImageDirective);

    function mediaImageDirective() {
        return {
            link: function(scope, element, attrs) {
                element.bind('error', function() {
                    element[0].outerHTML = '<div class="hs-media-image-placeholder"><h3>No image uploaded</h3></div>';
                });
            }
        };
    }
})();
