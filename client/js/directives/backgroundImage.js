(function() {
    'use strict';

    angular.module('main').directive('geBackgroundImg', backgroundImage);

    /**
     * Defines a directive for setting the background image.
     * @returns {Object} The directive.
     * {@link http://stackoverflow.com/a/13782311/259656}.
     */
    function backgroundImage() {
        return function($scope, $element, $attrs) {
            $attrs.$observe('geBackgroundImg', function(value) {
                $element.css({
                    'background-image': 'url(' + value + ')',
                    'background-size': 'cover'
                });
            });
        };
    }
})();
