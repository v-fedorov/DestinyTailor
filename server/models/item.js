var StatRange = require('../lib/statRange');

/**
 * Creates a new item.
 * @constructor
 * @param {Object} data The raw data from Bungie.
 * @param {Object} definitions The supporting definitions.
 */
var Item = function(data, definitions) {
    var itemDefinition = definitions.items.hasOwnProperty(data.itemHash) ? definitions.items[data.itemHash] : {};

    this.itemId = data.itemId;
    this.name = itemDefinition.itemName;
    this.bucketHash = data.bucketHash;
    this.itemTypeName = itemDefinition.itemTypeName;
    
    this.icon = itemDefinition.icon;
    this.setPrimaryStat(data, definitions);
    this.tierType = itemDefinition.tierType;
    this.tierTypeName = itemDefinition.tierTypeName;

    this.discipline = new StatRange(0, 0, 0);
    this.intellect = new StatRange(0, 0, 0);
    this.strength = new StatRange(0, 0, 0);
};

/**
 * Expands the item, fully loading it from the Bungie API, setting its instance based information.
 * @param {function} callback The callback triggered when the inventory's items have been fully loaded.
 */
Item.prototype.expand = function(callback) {
    // placeholder delegate for expanding the item to include the stats; this is currently mapped within the Bungie service.
};

/**
 * Sets the primary stat on the item.
 * @param {Object} data The data of the object.
 * @param {Object} definitions The definitions for the item.
 */
Item.prototype.setPrimaryStat = function(data, definitions) {
    if (data.primaryStat === undefined) {
        this.primaryStat = 0;
        this.primaryStatName = '';
    } else {
        this.primaryStat = data.primaryStat.value;
        this.primaryStatName = definitions.stats[data.primaryStat.statHash].statName;
    }
};

module.exports = Item;
