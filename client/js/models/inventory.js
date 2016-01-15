(function() {
    'use strict';

    angular.module('main').factory('Inventory', Model);
    Model.$inject = ['DEFINITIONS'];

    /**
     * Creates the constructor for the inventory model.
     * @param {Object} DEFINITIONS The constant definitions.
     * @returns {Function} The inventory constructor.
     */
    function Model(DEFINITIONS) {
        /**
         * Constructs a new inventory object used to store items owned by a character.
         * @constructor
         * @param {Object} character The owner of the inventory.
         * @param {Object} definitions The accompanying definitions.
         */
        function Inventory(character, definitions) {
            this.character = character;
            this.definitions = definitions;

            // weapons
            this.primaryWeapon = null;
            this.specialWeapon = null;
            this.heavyWeapon = null;

            // main
            this.ghost = null;
            this.helmet = null;
            this.gauntlets = null;
            this.chest = null;
            this.legs = null;

            // sub
            this.artifact = null;
            this.classItem = null;
        }

        /**
         * Sets the item based on it's bucket hash.
         * @param {Object} item The item to set.
         * @returns {Object} The modified inventory for chaining.
         */
        Inventory.prototype.setItem = function(item) {
            // set the item when we recognise the bucket hash)
            if (DEFINITIONS.itemBucketHash.hasOwnProperty(item.bucketHash)) {
                this[DEFINITIONS.itemBucketHash[item.bucketHash]] = item;
            };

            return this;
        };

        return Inventory;
    }
})();
