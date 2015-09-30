var Range = require('./range');

/**
 * Creates a new item.
 * @constructor
 */
var Item = function() {
    this.name = '';
    
    this.discipline = new Range(0, 0);
    this.intellect = new Range(0, 0);
    this.strength = new Range(0, 0);
};

/**
 * Enumeration for item categories, cross referenced with Bungie.
 */
var ItemCategoryType = Item.ItemCategoryType = {
    ARMOUR: {
        id: 20,
    },
    ARTIFACT: {
        id: 38,
        mapsTo: 'artifact'
    },    
    GHOST: {
        id: 39,
        mapsTo: 'ghost'
    },
    HEAD: {
        id: 45,
        mapsTo: 'head'
    },
    ARMS: {
        id: 46,
        mapsTo: 'arms'
    },
    CHEST: {
        id: 47,
        mapsTo: 'chest'
    },
    LEGS: {
        id: 48,
        mapsTo: 'legs'
    },
    CLASS: {
        id: 49,
        mapsTo: 'class'
    }
};

module.exports = Item;
