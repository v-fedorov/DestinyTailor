/**
 * Creates a new character.
 * @constructor
 */
var Character = function() {
    this.helmet = null;
    this.gloves = null;
    this.chest = null;
    this.legs = null;
    this.classItem = null;
    this.artifact = null;
    this.ghost = null;
};

/**
 * Sets the item on the character, for it's given item type.
 * @param {object} item The item to set.
 */
Character.prototype.setItem = function(item) {
    
};

module.exports = Character;