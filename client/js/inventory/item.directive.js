(function() {
    'use strict';

    angular.module('main').directive('geItem', item);

    /**
     * Defines a directive for showing a character's item.
     * @returns {Object} The directive.
     */
    function item() {
        return {
            restrict: 'AE',
            scope: {
                data: '=ngModel',
                selectedStats: '=ngSelectedStats'
            },
            templateUrl: 'js/inventory/item.html',
            link: link
        };

        /**
         * Initialises the directive for a character item.
         * @param {Object} $scope The scope.
         */
        function link($scope) {
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
        }
    }
})();
