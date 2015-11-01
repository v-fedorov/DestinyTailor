var Item = require('../models/item');

// main export
var itemStatMapper = module.exports = {};

// constants
var STAT_MAP = itemStatMapper.STAT_MAP = {
    1735777505: 'discipline',
    144602215: 'intellect',
    4244567218: 'strength'
};

/**
 * Maps the stats from the data, to the item.
 * @param {object} dataSource Either the data from Bungie, or an item.
 * @param {object} item The item to map to.
 * @returns The modified item with the stats.
 */
itemStatMapper.map = function(dataSource, item) {
    // if the data source is an item, map the stats
    if (dataSource.constructor === Item) {
        for (var stat in STAT_MAP) {
            item[STAT_MAP[stat]] = dataSource[STAT_MAP[stat]];
        };
    } else {
        if (setMinimums(dataSource, item)) {
            setMaximums(dataSource, item);    
        } else {
            setStatsWithFallback(dataSource, item);
        }
    }
    
    return item;
};

/**
 * Sets the minimum stat values on an item.
 * @param {object} data The item's raw data.
 * @param {object} item the item being modified.
 * @returns True when the stats were successfully set.
 */
function setMinimums(data, item) {
    for (var i = 0; i < data.talentNodes.length; i++) {
        var node = data.talentNodes[i];
        
        // assume we have found the minimum values when
        if (node.stateId === 'CreationOnly' && data.statsOnNodes.hasOwnProperty(node.nodeHash)) {
            data.statsOnNodes[node.nodeHash].currentNodeStats.forEach(function(stat) {
                item[STAT_MAP[stat.statHash]].min = stat.value;
                item[STAT_MAP[stat.statHash]].current = stat.value;
            });
            
            return true;
        };
    };
    
    console.warn('Setting the stats failed, using fallback');
    return false;
};

/**
 * Sets the maximum stat values available on an item.
 * @param {object} data The item's raw data.
 * @param {object} item The item being modified.
 */
function setMaximums(data, item) {
    // with each node, evaluate those that have stats, and aren't considered on creation
    data.talentNodes.forEach(function(node) {
        if (node.stateId !== 'CreationOnly' && data.statsOnNodes.hasOwnProperty(node.nodeHash)) {
            data.statsOnNodes[node.nodeHash][node.isActivated ? 'currentNodeStats' : 'nextNodeStats'].forEach(function(stat) {
                var itemStat = item[STAT_MAP[stat.statHash]];
                itemStat.max = Math.max(itemStat.min + stat.value, itemStat.max);
            });
        };
    });
};

/**
 * Sets the stats more ignorantly as we can't use node hashes.
 * @param {object} data The item's raw data.
 * @param {object} item The item being modified.
 */
function setStatsWithFallback(data, item) {
    // set all of the stats based on the stat nodes
    for (var nodeHash in data.statsOnNodes) {
        var stats = data.statsOnNodes[nodeHash];
        stats.currentNodeStats.forEach(function(stat) {
            var itemStat = item[STAT_MAP[stat.statHash]];
            
            // update all stats, we'll adjust the min and max at the end to fix items with a min of 0
            itemStat.min = itemStat.min === 0 ? stat.value : Math.max(itemStat.min, stat.value);
            itemStat.current += stat.value;
            itemStat.max += stat.value;
        });
        stats.nextNodeStats.forEach(function(stat) {
            // update the max
            item[STAT_MAP[stat.statHash]].max += stat.value;
        });
    };
    
    // adjust the min to 0 if the max is the same, and remove the stat if they're both 0
    for (var statHash in STAT_MAP) {
        var itemStat = item[STAT_MAP[statHash]];
        if (itemStat.min === 0 && itemStat.max === 0) {
            item[STAT_MAP[statHash]] = null;
        } else if (itemStat.min === itemStat.max) {
            itemStat.min = 0;
        }
    }
}