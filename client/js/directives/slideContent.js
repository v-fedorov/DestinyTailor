(function() {
    'use strict';

    angular.module('main').directive('slideContent', slideContent);

    /**
     * Initialises the slide-content directive.
     * @returns {Object} The directive.
     */
    function slideContent() {
        /**
         * Handles compiling the directive.
         * @param {Object} $element The element.
         * @param {Object} $attrs The attributes.
         * @returns {Function} The post-compilation handler.
         */
        function compile($element, $attrs) {
            // wrap the content
            $element.html('<div class="slideable__content" style="" >' + $element.html() + '</div>');
            return postLink;
        }

        /**
         * Adds the wrapper class to the slideable outter content.
         * @param {Object} $scope The scope.
         * @param {Object} $element The element (wrapper).
         */
        function postLink($scope, $element) {
            $element.addClass('slideable__wrapper');
        }

        return {
            restrict: 'A',
            compile: compile
        };
    }
})();
