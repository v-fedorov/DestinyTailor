var StatRange = require('../lib/StatRange');

/**
 * Creates a new item.
 * @constructor
 */
var Item = function() {
    this.itemId = null;
    
    this.platform = null;
    this.accountId = null;
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
    var _this = this,
        Bungie = require('../lib/Bungie');
        
    // get the item
    new Bungie().getInventoryItem(this, function(err, result) {
        if (err) {
            return callback(err);
        };
       
        // map the stats
        _this.discipline = result.discipline;
        _this.intellect = result.intellect;
        _this.strength = result.strength;
        
        callback(err, _this);
    });
};

module.exports = Item;
