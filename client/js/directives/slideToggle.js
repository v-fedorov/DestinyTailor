(function() {
    'use strict';

    angular.module('main').directive('slideToggle', slideToggle);

    /**
     * Constructs the directive for controlling slideable content.
     * @returns {Object} The directive.
     */
    function slideToggle() {
        /**
         * Initialises the slid toggler.
         * @param {Object} $scope The directive's scope.
         * @param {Object} $element The main element.
         * @param {Object} $attrs The attributes of the directive.
         */
        function link($scope, $element, $attrs) {
            var wrapper = null;
            var content = null;

            $attrs.expanded = false;

            $element.bind('click', function() {
                // lazy load the wrapper element
                if (!wrapper) {
                    wrapper = document.getElementById($attrs.slideToggle);
                }

                // lazy load the content element
                if (!content) {
                    content = wrapper.querySelector('.slideable__content');
                }

                // toggle the content
                if (!$attrs.expanded) {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    content.style.border = 0;
                    wrapper.style.height = content.clientHeight + 'px';
                } else {
                    wrapper.style.height = '0px';
                }

                $attrs.expanded = !$attrs.expanded;
            });
        }

        return {
            restrict: 'A',
            link: link
        };
    }
})();
