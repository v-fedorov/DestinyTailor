(function() {
    'use strict';

    angular.module('main').factory('inventoryService', inventoryService);
    inventoryService.$inject = ['$http', '$q', 'Inventory', 'InventoryAnalysis', 'Item', 'itemService'];

    /**
     * Defines the inventory analyser service.
     * @param {Object} $http The http utils from Angular.
     * @param {Object} $q The promises helper from Angular.
     * @param {Function} Inventory The inventory model constructor.
     * @param {Function} InventoryAnalysis The constructor for an inventory analysis.
     * @param {Function} Item The item constructor.
     * @param {Object} itemService The item service.
     * @returns {Object} The inventory service.
     */
    function inventoryService($http, $q, Inventory, InventoryAnalysis, Item, itemService) {
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
                .then(function(summary) {
                    return getNewInventory(character, summary);
                }).then(loadItems);
        }

        /**
         * Gets the inventory summary for the character, in the form of a promise.
         * @param {Object} character The character.
         * @returns {Object} A promise containing the data and definitions of the inventory summary.
         */
        function getInventorySummary(character) {
            var path = '/Platform/Destiny/' + character.membershipType
                        + '/Account/' + character.membershipId
                        + '/Character/' + character.characterId + '/Inventory/Summary/?definitions=true';

            // request the inventory summary
            return $http.get(path).then(function(result) {
                if (result.status !== 200) {
                    throw 'Unable to connect to Bungie';
                } else if (result.data.ErrorCode > 1) {
                    throw 'Failed to load inventory summary';
                }

                return result.data.Response;
            });
        }

        /**
         * Create a new inventory object based on the inventory summary.
         * @param {Object} character The character who owns the inventory.
         * @param {Object} summary The inventory summary.
         * @returns {Object} The inventory with the basic information.
         */
        function getNewInventory(character, summary) {
            var inventory = new Inventory(summary.definitions);

            // add each item, once we've transformed it slightly
            summary.data.items.forEach(function(data) {
                var item = new Item(character, data, summary.definitions);
                inventory.setItem(item);
            });

            return inventory;
        }

        /**
         * Gets the items for the given inventory.
         * @param {Object} inventory The inventory to load.
         * @returns {Object} A promise that is fulfilled when the items have loaded.
         */
        function loadItems(inventory) {
            return $q(function(resolve, reject) {
                var items = [
                    inventory.ghost, inventory.artifact, inventory.classItem,
                    inventory.helmet, inventory.gauntlets, inventory.chest, inventory.legs
                ];

                async.each(items, function(item, next) {
                    // load the item and their stats
                    itemService.getItem(item)
                    .then(function(result) {
                        return itemService.setItemStats(result, item);
                    }).then(function(item) {
                        next(null, item);
                    });
                }, function(err) {
                    // either resolve or reject, based on the error
                    if (err) {
                        reject(err);
                    } else {
                        resolve(inventory);
                    }
                });
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
