var api = require('./bungieApi'),
    CharacterBuilder = require('./characterBuilder'),
    ItemParser = require('./itemParser');

var BungieService = {};

/**
 * Gets the character information from Bungie.
 * @param {object} character An object containing the basic identifiers to select the character.
 * @param {function} callback The callback triggered when the character has loaded; result is a character.
 */
BungieService.getCharacter = function(character, callback) {
    api.getCharacter(character.platform, character.accountId, character.id, function(err, result) {
        if (err !== null) {
            return callback(err);
        };
        
        // build the character information
        var characterBuilder = new CharacterBuilder(result.definitions);
        characterBuilder.buildCharacter(character, result.data, callback);
    });
};

/**
 * Gets the character's inventory from Bungie.
 * @param {object} character An object containing the basic indentifiers.
 * @param {function} callback The callback triggered when the inventory has loaded.
 */
BungieService.getInventory = function(character, callback) {
    api.getInventory(character.platform, character.accountId, character.id, function(err, result) {
        callback(err, result);
    });
};

/**
 * Gets the item information from Bungie.
 * @param {object} character The character.
 * @param {number} itemId The instanced item's id.
 * @param {function} callback The callback triggered when the item has loaded.
 */
BungieService.getInventoryItem = function(character, itemId, callback) {
    // todo: consider caching
    api.getInventoryItem(character.platform, character.accountId, character.id, itemId, function(err, result) {
        var itemParser = new ItemParser();
        callback(null, itemParser.getItem(result.data, result.definitions));
    });
};

module.exports = BungieService;