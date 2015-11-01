(function(app) {
    'use strict';
    
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
            withEachStat(function(statName) {
                // check if the item has a path we can follow for the current stat
                if (items[0][statName]) {
                    itemEvaluated = true;
                    
                    var newProfile = new StatProfile(currentProfile)
                        .add(items[0], statName);
                    
                    this.evaluatePaths(items.slice(1), newProfile);
                };
            }.bind(this));    
        };
        
        // this accomodates for empty item slots (artifacts), or items that might not have stats (ghosts)
        if (!itemEvaluated) {
            this.evaluatePaths(items.slice(1), currentProfile);
        };
    };
    
    InventoryAnalyser.prototype.isUniqueStatProfile = function(statProfile) {
        statProfile.calculateTiers();
        for (var i = 0; i < this.profiles.length; i++) {
            if (statProfile.isEqual(this.profiles[i])) {
                return false;
            };
        };
        
        return true;
    };
    
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
    };
    
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
        withEachStat(function(statName) {
            if (item[statName] && statName !== selectedStatName) {
                option[statName] = item[statName].min;
                this[statName].value += item[statName].min;
            };
        }.bind(this));
        
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
    
    /**
     * Provides information about a stat for a character.
     * @constructor
     * @param {object} stat The optional stat to copy.
     */
    function Stat(stat) {
        this.value = stat ? stat.value : 0;
        this.tier = stat ? stat.tier : 0;
    };
    
    Stat.prototype.calculateTier = function() {
        this.tier = Math.floor(Math.min(this.value, 300) / 60);
    }

    /**
    * Iterates over each stat, by name, and executes the function delegate.
    * @param {function(string)} fn The function delegate.
    */
    function withEachStat(fn) {
        var STAT_NAMES = ['intellect', 'discipline', 'strength'];
        
        for (var i = 0; i < STAT_NAMES.length; i++) {
            var statName = STAT_NAMES[i];
            fn(statName);
        }
    }
    
    // register the class
    angular.module('destinyTailorApp').factory('InventoryAnalyser', function() { return InventoryAnalyser; });
})();
