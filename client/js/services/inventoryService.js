(function() {
    'use strict';

    angular.module('main').factory('inventoryService', inventoryService);
    inventoryService.$inject = ['$q', 'Inventory', 'InventoryAnalysis', 'Item', 'bungieService', 'itemService'];

    /**
     * Defines the inventory analyser service.
     * @param {Object} $q The promises helper from Angular.
     * @param {Function} Inventory The inventory model constructor.
     * @param {Function} InventoryAnalysis The constructor for an inventory analysis.
     * @param {Function} Item The item constructor.
     * @param {Object} bungieService The Bungie service.
     * @param {Object} itemService The item service.
     * @returns {Object} The inventory service.
     */
    function inventoryService($q, Inventory, InventoryAnalysis, Item, bungieService, itemService) {
        return {
            // functions
            getInventory: getInventory,
            getStatProfiles: getStatProfiles
        };

        /**
         * Loads the inventory for the given character.
         * @param {Object} character The character.
         * @returns {Object} A promise of the inventory, that is fulfilled when the inventory has been loaded.
         */
        function getInventory(character) {
            return getInventorySummary(character)
                .then(function(result) {
                    return getNewInventory(character, result);
                }).then(loadItems);
        }

        /**
         * Gets the inventory summary for the character, in the form of a promise.
         * @param {Object} character The character.
         * @returns {Object} A promise containing the data and definitions of the inventory summary.
         */
        function getInventorySummary(character) {
            return bungieService.getInventorySummary(character.membershipType, character.membershipId, character.characterId)
                .then(function(result) {
                    if (!result.data && !result.data.Response) {
                        throw 'Unable to connect to Bungie';
                    } else if (result.data.ErrorCode > 1) {
                        throw 'Failed to load inventory summary';
                    }

                    return result;
                });
        }

        /**
         * Create a new inventory object based on the inventory summary.
         * @param {Object} character The character who owns the inventory.
         * @param {Object} result The result of the inventory summary request.
         * @returns {Object} The inventory with the basic information.
         */
        function getNewInventory(character, result) {
            var inventory = new Inventory(character, result.data.Response.definitions);

            // add each item, once we've transformed it slightly
            result.data.Response.data.items.forEach(function(data) {
                var item = new Item(data, result.data.Response.definitions);
                inventory.setItem(item);
            });

            return inventory;
        }

        /**
         * Gets the items for the given inventory.
         * @param {Object} inventory The inventory to load.
         * @returns {Object} A promise with the inventory.
         */
        function loadItems(inventory) {
            var statLoaders = [
                inventory.ghost,
                inventory.artifact,
                inventory.classItem,
                inventory.helmet,
                inventory.gauntlets,
                inventory.chest,
                inventory.legs
                ].map(function(item) {
                    return itemService.loadStats(inventory.character, item);
                });

            // load the stats for each item
            return $q.all(statLoaders)
                .then(function() {
                    return inventory;
                });
        }

        /**
         * Gets the unique stat profiles for the given character.
         * @param {Object} character The character to analyse.
         */
        function getStatProfiles(character) {
            var analysis = new InventoryAnalysis(character);
            return analysis.profiles;
        }
    }
})();
