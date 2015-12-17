(function() {
    'use strict';

    angular.module('main').directive('geItemStat', itemStat);

    /**
     * Defines a directive for showing an item's stat.
     * @returns {Object} The directive.
     */
    function itemStat() {
        return {
            restrict: 'AE',
            scope: {
                abbreviation: '@abbreviation',
                data: '=ngModel',
                name: '@name',
                value: '=value'
            },
            templateUrl: 'js/inventory/itemStat.html',
            link: link
        };

        /**
         * Initialises the item stat.
         * @param {Object} $scope The scope of the directive.
         */
        function link($scope) {
            /**
             * Gets the current value associated with the stat.
             * @returns {Number} The stat's value.
             */
            $scope.getValue = function() {
                if ($scope.value !== undefined) {
                    return $scope.value;
                }

                return $scope.data.min;
            };
        }
    }
})();
