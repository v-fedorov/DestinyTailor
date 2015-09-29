/**
 * Creates a new item.
 * @constructor
 * @param {number} itemType The item's type.
 */
var Item = function(itemType) {
    this.itemType = itemType;
    
    this.discipline = 0;
    this.intellect = 0;
    this.strength = 0;
};

module.exports = Item;
