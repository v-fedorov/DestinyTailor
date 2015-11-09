var StatRange = require('../lib/statRange');

/**
 * Creates a new item.
 * @constructor
 * @param {Object} data The raw data from Bungie.
 * @param {Object} definitions The supporting definitions.
 */
var Item = function(data, definitions) {
    var definition = definitions.items.hasOwnProperty(data.itemHash) ? definitions.items[data.itemHash] : {};

    this.itemId = data.itemId;
    this.name = definition.itemName;
    this.bucketHash = data.bucketHash;
    this.setLightLevel(data.primaryStat);
    this.icon = definition.icon;

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
 * Sets the light level on the item from the primary stat.
 * @param {Object} primaryStat The primary stat containing the light level value.
 */
Item.prototype.setLightLevel = function(primaryStat) {
    if (primaryStat && primaryStat.value) {
        this.lightLevel = primaryStat.value;
    };
};

module.exports = Item;
