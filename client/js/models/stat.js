(function(app) {
    'use strict';

    /**
     * Defines the stat model.
     */
    function Model() {
        /**
         * Provides information about a stat for a character.
         * @constructor
         */
        function Stat() {
            this.value = 0;
            this.tier = 0;
            this.max = 300;
        }

        /**
         * Calculates the tiers for each stat.
         */
        Stat.prototype.calculateTier = function() {
            var tierValue = this.max / 5;
            this.tier = Math.floor(Math.min(this.value, this.max) / tierValue);
        };

        return Stat;
    };

    app.factory('Stat', Model);
})(angular.module('main'));
