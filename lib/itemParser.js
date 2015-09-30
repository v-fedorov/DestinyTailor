var Item = require('./item'),
    Range = require('./range');

// constants
var STAT_MAP = {
    STAT_DISCIPLINE : 'discipline',
    STAT_INTELLECT: 'intellect',
    STAT_STRENGTH: 'strength'
}    

/**
 * Constructs a new item parser.
 * @constructor
 * @param {object} definitions The definitions to detail the item.
 */
function ItemParser(definitions) {
    this.definitions = definitions;
};

/**
 * Gets the item from the parser.
 * @param {number} itemHash The item's hash identifier.
 * @returns The item.
 */
ItemParser.prototype.getItem = function(itemHash) {
    // validate we have the information for the item
    if (!this.definitions.items.hasOwnProperty(itemHash)) {
        return null;
    };
    
    // get the raw data and construct the result
    var data = this.definitions.items[itemHash],
        item = new Item();

    item.name = data.itemName;   
    for (var statHash in data.stats) {
        // validate we have a definition
        if (!this.definitions.stats.hasOwnProperty(statHash)) {
            continue;
        }
        
        // check if it is a stat we recognise
        var statDefinition = this.definitions.stats[statHash];
        if (!STAT_MAP.hasOwnProperty(statDefinition.statIdentifier)) {
            continue;
        }
        
        // set the stat
        var stat = data.stats[statHash];
        console.log(stat);
        console.log(STAT_MAP[statDefinition.statIdentifier])
        item[STAT_MAP[statDefinition.statIdentifier]] = new Range(stat.minimum, stat.maximum);
    };
    
    return item;
};

module.exports = ItemParser;
