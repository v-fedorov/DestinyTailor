(function() {
    'use strict';

    angular.module('main').directive('geBlurOn', geBlurOn);
    geBlurOn.$inject = ['$timeout'];

    /**
     * Defines a directive for blurring an element.
     * @param {Object} $timeout The timeout helper.
     * {@link http://stackoverflow.com/a/14837021}.
     */
    function geBlurOn($timeout) {
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
