var StatRange = require('./StatRange');

/**
 * Creates a new item.
 * @constructor
 */
var Item = function() {
    this.name = '';
    
    this.discipline = new StatRange(0, 0, 0);
    this.intellect = new StatRange(0, 0, 0);
    this.strength = new StatRange(0, 0, 0);
};

module.exports = Item;
