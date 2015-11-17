(function(app) {
    'use strict';

    /**
     * Defines a directive for showing a character's item.
     * @param {Object[]} STAT_NAMES The constant stat names.
     */
    app.directive('geItem', ['STAT_NAMES', function(STAT_NAMES) {
        /**
         * Initialises the directive for a character item.
         * @param {Object} $scope The scope.
         */
        function link($scope) {
            $scope.STAT_NAMES = STAT_NAMES;

            /**
             * Gets the current value, based on the data, and the selected stat information.
             * @param {String} statName The stat.
             * @returns {String} The current value.
             */
            $scope.getCurrentValue = function(statName) {
                if ($scope.selectedStats && $scope.selectedStats[statName] !== undefined) {
                    return $scope.selectedStats[statName];
                } else if ($scope.data && ($scope.data[statName] || null) !== null) {
                    return $scope.data[statName].current;
                } else {
                    return '';
                }
            };

            /**
             * Gets the CSS class that represents the tier.
             * @param {Number} tierType The tier.
             * @returns {String} The CSS class.
             */
            $scope.getTierTypeCssClass = function(tierType) {
                switch (tierType) {
                    case 3: return 'item--uncommon';
                    case 4: return 'item--rare';
                    case 5: return 'item--legendary';
                    case 6: return 'item--exotic';
                    default: return 'item--common';
                }
            };

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
    }]);
})(angular.module('main'));
