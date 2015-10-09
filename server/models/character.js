var Inventory = require('./inventory');

/**
 * Creates a new character.
 * @constructor
 * @param {number} platform The platform of the character.
 * @param {string} membershipId The membership id.
 * @param {string} characterId The character's id.
 */
var Character = function(platform, membershipId, characterId) {
    this.platform = platform;
    this.membershipId = membershipId;
    this.characterId = characterId;
    
    this.name = '';
    this.inventory = new Inventory();
};

module.exports = Character;