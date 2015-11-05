(function(app) {
    'use strict';

    /**
     * Defines the stat profile model.
     * @param {string[]} STAT_NAMES The constant stat names.
     * @param {object} Stat The stat model constructor.
     */
    app.factory('StatProfile', ['STAT_NAMES', 'Stat', function(STAT_NAMES, Stat) {
        /**
        * Provides a stat profile for a given path.
        * @constructor
        * @param {object} statProfile The optional stat profile to copy.
        */
        function StatProfile(statProfile) {
            statProfile = statProfile || {};

            this.discipline = new Stat(statProfile.discipline);
            this.intellect = new Stat(statProfile.intellect);
            this.strength = new Stat(statProfile.strength);
            this.items = statProfile.items ? statProfile.items.concat([]) : [];
            this.tierCount = 0;
        }

        /**
        * Adds the item to the profile, using the selected stat name as the max value.
        * @param {object} item The item being added.
        * @param {string} selectedStatName The stat being selected as the max.
        * @returns The modified stat profile.
        */
        StatProfile.prototype.add = function(item, selectedStatName) {
            var option = {};

            // set the name and maximum
            option.name = item.name;
            option[selectedStatName] = item[selectedStatName].max;
            this[selectedStatName].value += item[selectedStatName].max;

            // set the reamining stats
            for (var i = 0; i < STAT_NAMES.length; i++) {
                var statName = STAT_NAMES[i];
                if (item[statName] && statName !== selectedStatName) {
                    option[statName] = item[statName].min;
                    this[statName].value += item[statName].min;
                }
            }

            this.items.push(option);
            return this;
        };

        /**
        * Calculates the stat tiers.
        */
        StatProfile.prototype.calculateTiers = function() {
            this.discipline.calculateTier();
            this.intellect.calculateTier();
            this.strength.calculateTier();

            this.tierCount = this.discipline.tier + this.intellect.tier + this.strength.tier;
        };

        /**
        * Determines if the stat profile is equal to the other stat profile, based on the tiers.
        * @param {object} other The stat profile to compare.
        * @returns True when the stat profiles are considered equal.
        */
        StatProfile.prototype.isEqual = function(other) {
            return this.discipline.tier === other.discipline.tier
                && this.intellect.tier === other.intellect.tier
                && this.strength.tier === other.strength.tier;
        };

        return StatProfile;
    }]);
})(angular.module('destinyTailorApp'));
