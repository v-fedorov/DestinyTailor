(function() {
    'use strict';

    angular.module('main').directive('geBlurOn', blurOn);
    blurOn.$inject = ['$timeout'];

    /**
     * Defines a directive for blurring an element.
     * @param {Object} $timeout The timeout helper.
     * @returns {Object} The directive.
     * {@link http://stackoverflow.com/a/14837021}.
     */
    function blurOn($timeout) {
        return {
            scope: {
                trigger: '=geBlurOn'
            },
            link: link
        };

        /**
         * Registers the directive and its events.
         * @param {Object} $scope The directive's scope.
         * @param {Object} $element The main element.
         */
        function link($scope, $element) {
            $scope.$watch('trigger', function(value) {
                if (value) {
                    $timeout(function() {
                        $element[0].blur();
                    });
                }
            });
        }
    }
})();
