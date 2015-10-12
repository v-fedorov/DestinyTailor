var StatRange = require('../lib/statRange');

/**
 * Creates a new item.
 * @constructor
 */
var Item = function() {
    this.itemId = null;

    this.platform = null;
    this.membershipId = null;
    this.characterId = null;

    this.name = null;
    this.bucketHash = null;
    this.lightLevel = null;

    this.discipline = new StatRange(0, 0, 0);
    this.intellect = new StatRange(0, 0, 0);
    this.strength = new StatRange(0, 0, 0);
};

/**
 * Expands the item, fully loading it from the Bungie API, setting its instance based information.
 * @param {function} callback The callback triggered when the inventory's items have been fully loaded.
 */
Item.prototype.expand = function(callback) {
    // get the item
    var BungieService = require('../lib/bungieService');
    new BungieService().getInventoryItem(this.platform, this.membershipId, this.characterId, this.itemId, function(err, result) {
        if (err) {
            return callback(err);
        };

        // map the stats
        this.discipline = result.discipline;
        this.intellect = result.intellect;
        this.strength = result.strength;

        callback(err, this);
    }.bind(this), {
        lightLevel: this.lightLevel
    });
};

module.exports = Item;
