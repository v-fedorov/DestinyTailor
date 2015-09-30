var api = require('./bungieApi'),
    CharacterParser = require('./characterParser');

var BungieService = {};

/**
 * Gets the characters information from Bungie.
 * @param {number} platform The account's platform, e.g. PSN or XBox.
 * @param {number} accountId The account's id.
 * @param {number} chracterId The character's id.
 * @param {function} callback The callback triggered with the character information.
 */
BungieService.getCharacter = function(platform, accountId, characterId, callback) {
    api.getCharacter(platform, accountId, characterId, function(err, result) {
        callback(null, result);
        /*var parser = new CharacterParser(result.definitions);
        callback(null, parser.getCharacter(result.data));*/
    });
};

module.exports = BungieService;