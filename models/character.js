/**
 * Creates a new character.
 * @constructor
 * @param {number} platform The platform of the character.
 * @param {number} accountId The account id.
 * @param {number} id The character's id.
 */
var Character = function(platform, accountId, id) {
    this.id = id;
    this.accountId = accountId;
    this.platform = platform;
    
    this.name = '';
    
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