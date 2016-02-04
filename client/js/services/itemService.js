(function() {
    'use strict';

    angular.module('main').factory('itemService', itemService);
    itemService.$inject = ['$http', '$localStorage', '$q', 'DEFINITIONS', 'ITEM_TIERS'];

    /**
     * Creates the item service, primarily used for loading and mapping items.
     * @param {Object} $http The http helper from Angular.
     * @param {Object} $localStorage The local storage provider.
     * @param {Object} $q The promise provider.
     * @param {Object} DEFINITIONS The constant definitions.
     * @param {Object} ITEM_TIERS The constant for item tiers.
     * @returns {Object} The service.
     */
    function itemService($http, $localStorage, $q, DEFINITIONS, ITEM_TIERS) {
        // initialise the cache and return the service
        $localStorage.items = $localStorage.items || {};

        return {
            loadStats: loadStats
        };

        /**
         * Loads the stats for the given item.
         * @param {Object} character The owner of the item.
         * @param {Object} item The item to load.
         * @returns {Object} A promise; resolved once the object has loaded.
         */
        function loadStats(character, item) {
            // attempt to load the item from the cache
            if (loadStatsFromCache(item)) {
                return $q.resolve(item);
            }

            // request the item, set the stats, cache and go
            return requestItem(character, item)
                .then(function(result) {
                    setItemStats(result, item);
                    setCacheItem(item);
                    return item;
                });
        }

        /**
         * Attempts to load the item from the cache.
         * @param {Object} item The item to load.
         * @returns {Boolean} True when the stats can be cloned from the cache; otherwise false.
         */
        function loadStatsFromCache(item) {
            var cache = $localStorage.items[item.itemId] || null;

            // when we have a valid cache item, load the stats
            if (cache && cache.primaryStat === item.primaryStat) {
                for (var statHash in DEFINITIONS.stat) {
                    item[DEFINITIONS.stat[statHash]] = cache[DEFINITIONS.stat[statHash]];
                }

                return true;
            }

            return false;
        }

        /**
         * Sets an item within the cache.
         * @param {Object} item The item to cache.
         */
        function setCacheItem(item) {
            // only cache non-exotics... they're the glass needle!
            if (item.tierType !== ITEM_TIERS.exotic) {
                $localStorage.items[item.itemId] = item;
            }
        }

        /**
         * Requests the specific item information from the Bungie API.
         * @param {Object} character The owner of the item.
         * @param {Object} item The item to request.
         * @returns {Object} A promise, containing the response from Bungie.
         */
        function requestItem(character, item) {
            var path = '/Platform/Destiny/' + character.membershipType
                        + '/Account/' + character.membershipId
                        + '/Character/' + character.characterId
                        + '/Inventory/' + item.itemId + '/';

            // attempt to get the item
            return $http.get(path).then(function(result) {
                if (result.status !== 200) {
                    throw 'Unable to connect to Bungie';
                } else if (result.ErrorCode > 1) {
                    throw 'Unable to load item';
                }

                return result.data.Response;
            });
        }

        /**
         * Sets the stats on the item, based on the raw response from Bungie.
         * @param {Object} result The result of an API request to Bungie.
         * @param {Object} item The item where the stats are being set.
         */
        function setItemStats(result, item) {
            var dataSource = result.data;
            if (setMinimums(dataSource, item)) {
                setMaximums(dataSource, item);
            } else {
                setStatsWithFallback(dataSource, item);
            }
        }

        /**
         * Sets the minimum stat values on an item.
         * @param {Object} data The item's raw data.
         * @param {Object} item the item being modified.
         * @returns {Boolean} True when the stats were successfully set.
         */
        function setMinimums(data, item) {
            for (var i = 0; i < data.talentNodes.length; i++) {
                var node = data.talentNodes[i];

                // assume we have found the minimum values when
                if (node.stateId === 'CreationOnly' && data.statsOnNodes.hasOwnProperty(node.nodeHash)) {
                    data.statsOnNodes[node.nodeHash].currentNodeStats.forEach(function(stat) {
                        item[DEFINITIONS.stat[stat.statHash]].min = stat.value;
                        item[DEFINITIONS.stat[stat.statHash]].current = stat.value;
                    });

                    return true;
                };
            };

            console.warn('Setting the stats failed, using fallback');
            return false;
        };

        /**
         * Sets the maximum stat values available on an item.
         * @param {Object} data The item's raw data.
         * @param {Object} item The item being modified.
         */
        function setMaximums(data, item) {
            // with each node, evaluate those that have stats, and aren't considered on creation
            data.talentNodes.forEach(function(node) {
                if (node.stateId !== 'CreationOnly' && data.statsOnNodes.hasOwnProperty(node.nodeHash)) {
                    data.statsOnNodes[node.nodeHash][node.isActivated ? 'currentNodeStats' : 'nextNodeStats'].forEach(function(stat) {
                        var itemStat = item[DEFINITIONS.stat[stat.statHash]];
                        itemStat.max = Math.max(itemStat.min + stat.value, itemStat.max);
                    });
                };
            });
        };

        /**
         * Sets the stats more ignorantly as we can't use node hashes.
         * @param {Object} data The item's raw data.
         * @param {Object} item The item being modified.
         */
        function setStatsWithFallback(data, item) {
            // set all of the stats based on the stat nodes
            for (var nodeHash in data.statsOnNodes) {
                var stats = data.statsOnNodes[nodeHash];

                stats.currentNodeStats.forEach(function(stat) {
                    var itemStat = item[DEFINITIONS.stat[stat.statHash]];

                    // update all stats, we'll adjust the min and max at the end to fix items with a min of 0
                    itemStat.min = itemStat.min === 0 ? stat.value : itemStat.min;
                    itemStat.current += stat.value;
                    itemStat.max += stat.value;
                });

                // update the max
                stats.nextNodeStats.forEach(function(stat) {
                    item[DEFINITIONS.stat[stat.statHash]].max += stat.value;
                });
            };

            // adjust the min to 0 if the max is the same, and remove the stat if they're both 0
            for (var statHash in DEFINITIONS.stat) {
                var itemStat = item[DEFINITIONS.stat[statHash]];
                if (itemStat.min === 0 && itemStat.max === 0) {
                    item[DEFINITIONS.stat[statHash]] = null;
                } else if (itemStat.min === itemStat.max) {
                    itemStat.min = 0;
                }
            }
        }
    }
})();
