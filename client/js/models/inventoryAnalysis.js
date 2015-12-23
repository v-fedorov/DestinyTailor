(function() {
    'use strict';

    angular.module('main').factory('InventoryAnalysis', Model);
    Model.$inject = ['STAT_NAMES', 'StatProfile'];

    /**
     * Provides an analysis of a character's inventory, in the form of stat profiles.
     * @param {Object[]} STAT_NAMES The constant stat names.
     * @param {Function} StatProfile The stat profile model constructor.
     * @returns {Function} The inventory analysis model constructor.
     */
    function Model(STAT_NAMES, StatProfile) {
        /**
        * Evaluates all possible stat paths for a given character's inventory.
        * @constructor
        * @param {Object} character The character being evaluated.
        */
        function InventoryAnalysis(character) {
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

            // filter the profile and assign them an id
            this.filterProfiles();
            this.profiles.forEach(function(profile, i) {
                profile.statProfileId = i;
            });
        }

        /**
        * Visits all of the items' stats to evaluate all possible paths, logging unique paths.
        * @param {Object[]} items Remaining items.
        * @param {Object} currentProfile The current stat profile being evaluated.
        */
        InventoryAnalysis.prototype.evaluatePaths = function(items, currentProfile) {
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
        InventoryAnalysis.prototype.addProfileWhenUnique = function(statProfile) {
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
        InventoryAnalysis.prototype.filterProfiles = function() {
            // take the first profile, and then attempt to add its siblings
            var filteredProfiles = this.profiles.slice(0, 1);
            for (var i = 1; i < this.profiles.length; i++) {
                this.addStatProfileWhenSuperior(this.profiles[i], filteredProfiles);
            }

            this.profiles = filteredProfiles;
        };

        /**
         * Attempts to "add" a stat profile when it is considered superior to its siblings.
         * @param {Object} statProfile The stat profile being checked.
         * @param {Object[]} others The siblings to compare it against.
         */
        InventoryAnalysis.prototype.addStatProfileWhenSuperior = function(statProfile, others) {
            for (var i = 0; i < others.length; i++) {
                var other = others[i];

                // ignore the same object
                if (statProfile === other) {
                    break;
                }

                // when the stat profile is better in every way, replace it
                if (statProfile.discipline.tier >= other.discipline.tier
                    && statProfile.intellect.tier >= other.intellect.tier
                    && statProfile.strength.tier >= other.strength.tier) {
                    others[i] = statProfile;
                    return;
                }

                // when the stat profile is inferior in every way, ignore it
                if (statProfile.discipline.tier <= other.discipline.tier
                    && statProfile.intellect.tier <= other.intellect.tier
                    && statProfile.strength.tier <= other.strength.tier) {
                    return;
                }
            }

            others.push(statProfile);
        };

        return InventoryAnalysis;
    }
})();
