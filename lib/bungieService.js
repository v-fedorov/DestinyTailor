var api = require('./bungieApi'),
    Character = require('../models/character'),
    Item = require('./item');

var BungieService = {};

/**
 * Gets the characters information from Bungie.
 * @param {number} platform The account's platform, e.g. PSN or XBox.
 * @param {number} accountId The account's id.
 * @param {number} chracterId The character's id.
 * @param {function} callback The callback triggered with the character information.
 */
BungieService.getCharacter = function(platform, accountId, characterId, callback) {
    api.getCharacter(platform, accountId, characterId, function(result) {
        var character = parseCharacterItems(result);
        callback(null, character);
    });
};

/**
 * Parses the result of a Bungie API result for a character.
 * @param {object} result The API result.
 * @returns The characters items.
 */
function parseCharacterItems(result) {
    var character = new Character();
    return character;
};

module.exports = BungieService;