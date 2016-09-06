(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('hsVideoPlayer', videoPlayerDirective);

    function videoPlayerDirective() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<iframe width="560" height="349" frameborder="0" allowfullscreen></iframe>',
            link: function (scope, element, attrs) {
                element.attr('src', attrs.url);
            }
        };
    }
})();
