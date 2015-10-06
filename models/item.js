var StatRange = require('../lib/StatRange');

/**
 * Creates a new item.
 * @constructor
 * @param {number} id The item id.
 * @param {number} lightLevel The item light level.
 */
var Item = function() {
    this.id = null;
    this.lightLevel = null;
    
    this.name = '';
    
    this.discipline = new StatRange(0, 0, 0);
    this.intellect = new StatRange(0, 0, 0);
    this.strength = new StatRange(0, 0, 0);
};

module.exports = Item;
