(function(app) {
    'use strict';

    angular.module('main').directive('geStatProfile', statProfile);
    statProfile.$inject = ['STAT_NAMES'];

    /**
     * Defines a directive for showing a character's stat profile.
     * @param {Object[]} STAT_NAMES The constant stat names.
     * @returns {Object} The directive.
     */
    function statProfile(STAT_NAMES) {
        /**
         * Registers the event for selecting the stat profile.
         * @param {Object} $scope The directive's scope.
         * @param {Object} $element The main element.
         */
        function link($scope, $element) {
            $scope.STAT_NAMES = STAT_NAMES;
            $scope.showInventory = false;

            /**
             * Handles the stat profile being selected.
             */
            $scope.select = function() {
                $scope.onSelect($scope.data);
                $scope.showInventory = !$scope.showInventory;
            };

            /**
             * Determines if the specified tier, i, is complete for the stat.
             * @param {Object} stat The stat being checked.
             * @param {Number} i The tier index, 1-based.
             * @returns {Boolean} True when complete (full); otherwise false.
             */
            $scope.isTierComplete = function(stat, i) {
                return stat.tier >= i;
            };

            /**
             * Determines if the specified tier, i, is determined as partially complete for the stat.
             * @param {Object} stat The stat being checked.
             * @param {Number} i The tier index, 1-based.
             * @returns {Boolean} True when partially complete; otherwise false.
             */
            $scope.isTierPartiallyComplete = function(stat, i) {
                return (stat.tier < i) && (stat.tier + 1 === i);
            };

            /**
             * Gets the completeness of a tier, as a percentage value.
             * @param {Object} stat The stat being checked.
             * @param {Number} i The tier index, 1-based.
             * @returns {Number} Percentage value of the completeness for a given tier.
             */
            $scope.getTierCompleteness = function(stat, i) {
                var tierSize = stat.max / 5;
                return (100 / tierSize) * (stat.value % tierSize);
            };
        }

        return {
            restrict: 'AE',
            scope: {
                data: '=ngModel',
                character: '=ngCharacter',
                onSelect: '=ngSelect',
                selected: '=ngSelected'
            },
            templateUrl: 'js/character/statProfile.html',
            link: link
        };
    };
})();
