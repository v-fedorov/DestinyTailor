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
        };

        /**
         * Calculates the tiers for each stat.
         */
        Stat.prototype.calculateTier = function() {
            this.tier = Math.floor(Math.min(this.value, 300) / 60);
        };

        return Stat;
    });
})(angular.module('destinyTailorApp'));
