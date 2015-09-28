var config = require('../config/'),
    http = require('http'),
    util = require('util');

var bungieApiService = {};

/**
 * Gets the characters information from the Bungie API.
 * @param {number} platform The account's platform, e.g. PSN or XBox.
 * @param {number} accountId The account's id.
 * @param {number} chracterId The character's id.
 * @param {function} callback The callback triggered once the request has completed.
 */
bungieApiService.getCharacter = function(platform, accountId, characterId, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/', platform, accountId, characterId),
        options = getOptions(path);
        
    http.get(options, function(res) {
        var data = '';
        
        // iteratively build up the data
        res.on('data', function(chunk) {
            data += chunk;
        });
        
        // when complete, return the result
        res.on('end', function() {
            callback(JSON.parse(data));
        });
    }).on('error', function(e) {
        throw e;
    });
};

/**
 * Gets the default options for making a request to the Bungie API.
 * @param {string} path The path to be used within the options.
 * @returns {object} The options.
 */
var getOptions = function(path) {
    return {
        host: 'www.bungie.net',
        port: '80',
        path: path,
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': config.xApiKey
        }
    };
}

module.exports = bungieApiService;