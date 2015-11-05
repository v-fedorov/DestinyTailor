(function(app) {
    'use strict';

    /**
     * Defines the stat model.
     */
    app.factory('Stat', function() {
        /**
        * Provides information about a stat for a character.
        * @constructor
        * @param {object} stat The optional stat to copy.
        */
        function Stat(stat) {
            this.value = stat ? stat.value : 0;
            this.tier = stat ? stat.tier : 0;
            this.max = stat ? stat.max : 300;
        }

        /**
         * Calculates the tiers for each stat.
         */
        Stat.prototype.calculateTier = function() {
            var tierValue = this.max / 5;
            this.tier = Math.floor(Math.min(this.value, this.max) / tierValue);
        };

        return Stat;
    });
})(angular.module('destinyTailorApp'));
