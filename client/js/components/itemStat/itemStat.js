(function() {
    'use strict';

    angular.module('main').directive('geItemStat', itemStat);
    itemStat.$inject = ['TEMPLATE_URLS'];

    /**
     * Defines a directive for showing an item's stat.
     * @param {Object} TEMPLATE_URLS The template Urls constant.
     * @returns {Object} The directive.
     */
    function itemStat(TEMPLATE_URLS) {
        return {
            restrict: 'AE',
            scope: {
                abbreviation: '@abbreviation',
                data: '=ngModel',
                name: '@name',
                value: '=value'
            },
            templateUrl: TEMPLATE_URLS.components.itemStat,
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
