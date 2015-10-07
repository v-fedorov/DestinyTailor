var Item = require('../../models/item');

// constants
var STAT_MAP = {
    1735777505: 'discipline',
    144602215: 'intellect',
    4244567218: 'strength'
};

/**
 * Constructs a new item parser.
 * @constructor
 */
function ItemFormatter() { };

/**
 * Gets the item from the parser.
 * @param {object} identifiers The identifiers for the character.
 * @param {number} data The data object containing the item, and optional stats.
 * @param {object} definitions The definitions.
 * @returns The item.
 */
ItemFormatter.prototype.getItem = function(identifiers, data, definitions) {
    var item = new Item();
    
    // set the basic identifiers
    item.platform = identifiers.platform;
    item.accountId = identifiers.accountId;
    item.characterId = identifiers.characterId;
    
    // set the basic information
    item.itemId = data.item.itemId || data.item.itemInstanceId;
    item.name = definitions.items[data.item.itemHash].itemName;
    item.bucketHash = data.item.bucketHash;

    // set the light level if we can
    if (data.item.primaryStat) {
        item.lightLevel = data.item.primaryStat.value;
    };
    
    // set the default ranges
    withEachStat(item, function(range) {
        range.min = Infinity;
        range.max = -Infinity;
    });
    
    // loop through each node stat and check its children
    for (var hash in data.statsOnNodes) {
        var talentNode = getTalentNode(data, parseInt(hash, 10));
        
        // check both the current, and next, node stats
        setStats(item, talentNode, data.statsOnNodes[hash].currentNodeStats);
        setStats(item, talentNode, data.statsOnNodes[hash].nextNodeStats);
    }
    
    sanitiseDefaultRanges(item);
    return item;
};

/**
 * Gets the item's talent node based on its hash.
 * @param {object} data The item's data.
 * @param {number} hash The talent node's hash.
 * @returns The talent node. 
 */
var getTalentNode = function(data, hash) {
    for (var i = 0; i < data.talentNodes.length; i++) {
        if (data.talentNodes[i].nodeHash === hash) {
            return data.talentNodes[i];
        };
    };
    
    return null;
};

/**
 * Sanitises the default ranges on stats for an item.
 * @param {object} item The item.
 */
var sanitiseDefaultRanges = function(item) {
    withEachStat(item, function(range) {
        // check if a range has been set
        range.min = range.min !== Infinity ? range.min : -Infinity;
        range.max = range.max !== -Infinity ? range.max : Infinity;
        
        // when the range is classified as unspecified, set to 0
        if (range.min === -Infinity && range.max === Infinity) {
            range.min = 0;
            range.max = 0;
        };
    });
};

/**
 * Set the stats on the item, based on the node stats.
 * @param {object} item The item being updated.
 * @param {object} talentNode The node containing the talent's information
 * @param {array} nodeStats Collection of stats on a node.
 */
var setStats = function(item, talentNode, nodeStats) {
    for (var i = 0; i < nodeStats.length; i++) {
        var stat = nodeStats[i],
            range = item[STAT_MAP[stat.statHash]];
            
        // check we have a range to play with
        if (!range) {
            continue;
        };

        if (talentNode.hidden) {
            // is it safe to assume that because it's 'hidden', that it's the default value
            range.min = Math.min(range.min, stat.value);
        } else {
            // otherwise we increment
            range.max = Math.max(range.max, range.min + stat.value);
        }
    }
};

/**
 * Iterates over each stat within the map and selects it from the item.
 * @param {object} item The item.
 * @param {function} fn The callback function called for each stat.
 */
var withEachStat = function(item, fn) {
    for (var statHash in STAT_MAP) {
        fn(item[STAT_MAP[statHash]]);
    };
};

module.exports = ItemFormatter;
