var api = require('./bungieApi'),
    CharacterParser = require('./characterParser'),
    ItemParser = require('./itemParser');

var BungieService = {};

/**
 * Gets the character information from Bungie.
 * @param {object} character An object containing the basic identifiers to select the character.
 * @param {function} callback The callback triggered with the character information.
 */
BungieService.getCharacter = function(character, callback) {
    api.getCharacter(character.platform, character.accountId, character.id, function(err, result) {
        //var parser = new CharacterParser(result.definitions);
        //parser.getCharacter(result.data);
        callback(err, result.data);
    });
};

/**
 * Gets the item information from Bungie.
 * @param {object} character The character.
 * @param {number} itemId The instanced item's id.
 * @param {function} callback The callback triggered once the request has completed.
 */
BungieService.getInventoryItem = function(character, itemId, callback) {
    // todo: consider caching
    api.getInventoryItem(character.platform, character.accountId, character.id, itemId, function(err, result) {
        var itemParser = new ItemParser();
        callback(null, itemParser.getItem(result.data, result.definitions));
    });
};

module.exports = BungieService;