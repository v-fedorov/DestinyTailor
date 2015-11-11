(function(app) {
    'use strict';

    /**
     * Defines the stat model.
     */
    function Stat() {
        /**
        * Provides information about a stat for a character.
        * @constructor
        */
        function Model() {
            this.value = 0;
            this.tier = 0;
            this.max = 300;
        }

        /**
         * Calculates the tiers for each stat.
         */
        Model.prototype.calculateTier = function() {
            var tierValue = this.max / 5;
            this.tier = Math.floor(Math.min(this.value, this.max) / tierValue);
        };

        return Model;
    };

    app.factory('Stat', Stat);
})(angular.module('main'));
