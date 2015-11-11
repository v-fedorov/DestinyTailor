(function(app) {
    'use strict';

    /**
     * Defines a directive for showing a character's item.
     */
    app.directive('geItem', function() {
        /**
         * Initialises the directive for a character item.
         * @param {Object} $scope The scope.
         */
        function link($scope) {
            /**
             * Determines if the current stat is considered at the maximum value.
             * @param {String} statName The stat.
             * @returns {Boolean} True when the stat is considered maxed.
             */
            $scope.isStatMaxed = function(statName) {
                return $scope.data
                    && ($scope.data[statName] || 0) !== 0
                    && $scope.data[statName].max === $scope.getCurrentValue(statName);
            };

            /**
             * Gets the current value, based on the data, and the selected stat information.
             * @param {String} statName The stat.
             * @returns {String} The current value.
             */
            $scope.getCurrentValue = function(statName) {
                if ($scope.selectedStats && ($scope.selectedStats[statName] || null) !== null) {
                    return $scope.selectedStats[statName];
                } else if ($scope.data && ($scope.data[statName] || null) !== null) {
                    return $scope.data[statName].current;
                } else {
                    return '';
                }
            };
        }

        return {
            restrict: 'AE',
            scope: {
                data: '=ngModel',
                selectedStats: '=ngSelectedStats'
            },
            templateUrl: 'js/views/item.html',
            link: link
        };
    });
})(angular.module('main'));
