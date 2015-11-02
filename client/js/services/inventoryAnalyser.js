(function(app) {
    'use strict';

    /**
     * Defines the inventory analyser service.
     * @param {string[]} STAT_NAMES The constant stat names.
     * @param {object} StatProfile The stat profile model constructor.
     */
    app.factory('inventoryAnalyser', ['STAT_NAMES', 'StatProfile', function(STAT_NAMES, StatProfile) {
        var scope = {
            getStatProfiles: getStatProfiles
        };

        /**
         * Gets the unique stat profiles for the given character.
         * @param {object} character The character to analyse.
         */
        function getStatProfiles(character) {
            var analyser = new InventoryAnalyser(character);
            return analyser.profiles;
        };

        /**
        * Evaluates all possible stat paths for a given character's inventory.
        * @constructor
        * @param {object} character The character being evaluated.
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
            ]);
        };

        /**
        * Visits all of the items in a tree-like structure to evaluate all possible paths.
        * @param {object[]} items Remaining items.
        * @param {object} currentProfile The current stat profile being evaluated.
        */
        InventoryAnalyser.prototype.evaluatePaths = function(items, currentProfile) {
            var itemEvaluated = false;
            currentProfile = currentProfile || new StatProfile(null);

            // when there are no items left to check, add the breadcrumbs to the paths
            if (items.length === 0) {
                if (this.isUniqueStatProfile(currentProfile)) {
                    this.profiles.push(currentProfile);
                }

                return;
            };

            // check if the item is defined, and if so, evaluate all possible paths
            if (items[0]) {
                for (var i = 0; i < STAT_NAMES.length; i++) {
                    var statName = STAT_NAMES[i];
                    // check if the item has a path we can follow for the current stat
                    if (items[0][statName]) {
                        itemEvaluated = true;

                        var newProfile = new StatProfile(currentProfile)
                            .add(items[0], statName);

                        this.evaluatePaths(items.slice(1), newProfile);
                    };
                };
            };

            // this accomodates for empty item slots (artifacts), or items that might not have stats (ghosts)
            if (!itemEvaluated) {
                this.evaluatePaths(items.slice(1), currentProfile);
            };
        };

        /**
         * Determines if the stat profile is unique, or if there is already a similar one.
         * @param {object} statProfile The stat profile to check.
         * @returns True when the statProfile is unique; otherwise false.
         */
        InventoryAnalyser.prototype.isUniqueStatProfile = function(statProfile) {
            statProfile.calculateTiers();
            for (var i = 0; i < this.profiles.length; i++) {
                if (statProfile.isEqual(this.profiles[i])) {
                    return false;
                };
            };

            return true;
        };

        return scope;
    }]);
})(angular.module('destinyTailorApp'));
