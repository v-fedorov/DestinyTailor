var Inventory = require('./inventory');

/**
 * Creates a new character.
 * @constructor
 * @param {number} platform The platform of the character.
 * @param {number} accountId The account id.
 * @param {number} characterId The character's id.
 */
var Character = function(platform, accountId, characterId) {
    this.platform = platform;
    this.accountId = accountId;
    this.characterId = characterId;
    
    this.name = '';
    this.inventory = new Inventory();
};

module.exports = Character;