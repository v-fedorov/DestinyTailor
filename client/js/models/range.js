(function() {
    'use strict';

    angular.module('main').factory('Range', Model);

    /**
     * Defines the range model.
     * @returns {Function} The range constructor.
     */
    function Model() {
        /**
         * Constructs a new range for a number.
         * @constructor
         * @param {Number} min The minimum value.
         * @param {Number} max The maximum value.
         * @param {Number} current The current value.
         */
        function Range(min, max, current) {
            this.min = min;
            this.max = max;

            this.current = current;
        }

        return Range;
    }
})();
