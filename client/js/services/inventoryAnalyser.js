(function(app) {
    'use strict';

    /**
     * Defines the inventory analyser service.
     * @param {Object[]} STAT_NAMES The constant stat names.
     * @param {Object} StatProfile The stat profile model constructor.
     */
    app.factory('inventoryAnalyser', ['STAT_NAMES', 'StatProfile', function(STAT_NAMES, StatProfile) {
        var $scope = {};

        /**
         * Gets the unique stat profiles for the given character.
         * @param {Object} character The character to analyse.
         */
        $scope.getStatProfiles = function(character) {
            var analyser = new InventoryAnalyser(character);
            return analyser.profiles;
        };

        /**
        * Evaluates all possible stat paths for a given character's inventory.
        * @constructor
        * @param {Object} character The character being evaluated.
        */
        function InventoryAnalyser(character) {
            this.profiles = [];
            this.evaluatePaths([
                character.inventory.ghost,
                character.inventory.helmet,
                character.inventory.gauntlets,
                character.inventory.chest,
                character.inventory.legs,
                character.inventory.classItem,
                character.inventory.artifact
            ], new StatProfile(null));

            this.filterProfiles();
        }

        /**
        * Visits all of the items' stats to evaluate all possible paths, logging unique paths.
        * @param {Object[]} items Remaining items.
        * @param {Object} currentProfile The current stat profile being evaluated.
        */
        InventoryAnalyser.prototype.evaluatePaths = function(items, currentProfile) {
            // when we're add the end of a path, attempt to add the profile
            if (items.length === 0) {
                return this.addProfileWhenUnique(currentProfile);
            }

            var i = 0;
            var itemEvaluated = false;

            while (items[0] && i < STAT_NAMES.length) {
                // check if the item has a path we can follow for the current stat
                var statName = STAT_NAMES[i].name;
                if (items[0][statName]) {
                    var newPath = angular.copy(currentProfile)
                        .add(items[0], statName);

                    itemEvaluated = true;
                    this.evaluatePaths(items.slice(1), newPath);
                }

                i++;
            }

            // this accomodates for empty item slots (artifacts), or items that might not have stats (ghosts)
            if (!itemEvaluated) {
                this.evaluatePaths(items.slice(1), currentProfile);
            }
        };

        /**
         * Attempts to add a profile, if it is considered unique.
         * @param {Object} statProfile Stat profile being added.
         */
        InventoryAnalyser.prototype.addProfileWhenUnique = function(statProfile) {
            statProfile.calculateTiers();
            for (var i = 0; i < this.profiles.length; i++) {
                if (statProfile.isEqual(this.profiles[i])) {
                    return;
                }
            }

            this.profiles.push(statProfile);
        };

        /**
         * Filters the profiles, removing those that are considered redundant or inferior e.g. 4-3-2, when compared to 4-4-2.
         */
        InventoryAnalyser.prototype.filterProfiles = function() {
            var i = 0;
            while (i < this.profiles.length) {
                if (this.isStatProfileInferior(this.profiles[i])) {
                    this.profiles.splice(i, 1);
                } else {
                    i++;
                }
            }
        };

        /**
         * Determines if the stat profile is considered inferior, when compared to the available stat profiles.
         * @param {Object} statProfile The stat profile being compared.
         * @returns {Boolean} True when the stat profile is inferior; otherwise false.
         */
        InventoryAnalyser.prototype.isStatProfileInferior = function(statProfile) {
            for (var i = 0; i < this.profiles.length; i++) {
                if (statProfile !== this.profiles[i]
                    && statProfile.discipline.tier >= this.profiles[i].discipline.tier
                    && statProfile.intellect.tier >= this.profiles[i].intellect.tier
                    && statProfile.strength.tier >= this.profiles[i].strength.tier) {
                    return false;
                }
            }

            return true;
        };

        return $scope;
    }]);
})(angular.module('main'));
