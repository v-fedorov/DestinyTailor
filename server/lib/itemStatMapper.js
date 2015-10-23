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
        setMinimums(dataSource, item);
        setMaximums(dataSource, item);
    }
    
    return item;
};

/**
 * Sets the minimum stat values on an item.
 * @param {object} data The item's raw data.
 * @param {object} item the item being modified.
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
            
            return;
        };
    };
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
