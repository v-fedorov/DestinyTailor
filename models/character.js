/**
 * Creates a new character.
 * @constructor
 */
var Character = function(platform, accountId, id) {
    // identifiers
    this.id = id;
    this.accountId = accountId;
    this.platform = platform;
    
    // items
    this.artifact = null;
    this.chest = null;
    this.classItem = null;
    this.gauntlets = null;
    this.ghost = null;
    this.heavyWeapon = null;
    this.helmet = null;
    this.legs = null;
    this.primaryWeapon = null;
    this.specialWeapon = null;
};

module.exports = Character;