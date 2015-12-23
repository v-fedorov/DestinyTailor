(function() {
    'use strict';

    angular.module('main').factory('itemService', itemService);
    itemService.$inject = ['$http', 'DEFINITIONS'];

    /**
     * Creates the item service, primarily used for loading and mapping items.
     * @param {Object} $http The http helper from Angular.
     * @param {Object} DEFINITIONS The constant definitions.
     * @returns {Object} The service.
     */
    function itemService($http, DEFINITIONS) {
        return {
            getItem: getItem,
            setItemStats: setItemStats
        };

        /**
         * Gets the detailed item from the given item.
         * @param {Object} item The item to load.
         */
        function getItem(item) {
            var path = '/Platform/Destiny/' + item.owner.membershipType
                        + '/Account/' + item.owner.membershipId
                        + '/Character/' + item.owner.characterId
                        + '/Inventory/' + item.itemId + '/?definitions=true';

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
