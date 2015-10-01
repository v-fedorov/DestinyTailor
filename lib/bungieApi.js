var config = require('../config/'),
    http = require('http'),
    util = require('util');

var BungieApi = {};

/**
 * Gets the character's information from the Bungie API.
 * @param {number} platform The account's platform, e.g. PSN or XBox.
 * @param {number} accountId The account's id.
 * @param {number} chracterId The character's id.
 * @param {function} callback The callback triggered once the request has completed.
 */
BungieApi.getCharacter = function(platform, accountId, characterId, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/', platform, accountId, characterId);
    queryApi(getOptions(path), callback);
};

/**
 * Gets the character's inventory from the Bungie API.
 * @param {number} platform The account's platform, e.g. PSN or XBox.
 * @param {number} accountId The account's id.
 * @param {number} chracterId The character's id.
 * @param {function} callback The callback triggered once the request has completed.
 */
BungieApi.getInventory = function(platform, accountId, characterId, callback) {
    var path = util.format('Platform/Destiny/%s/Account/%s/Character/%s/Inventory/Summary/', platform, accountId, characterId);
    queryApi(getOptions(path), callback);
}

/**
 * Gets the instanced item information.
 * @param {number} platform The account's platform, e.g. PSN or XBox.
 * @param {number} accountId The account's id.
 * @param {number} chracterId The character's id.
 * @param {number} itemId The instanced item's id.
 * @param {function} callback The callback triggered once the request has completed.
 */
BungieApi.getInventoryItem = function(platform, accountId, characterId, itemId, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/Inventory/%s/?definitions=true', platform, accountId, characterId, itemId);
    queryApi(getOptions(path), callback);
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
};

/**
 * Makes a get request to the Bungie API with the specified options.
 * @param {object} options The request options.
 * @param {function} callback The callback used when the request finishes, or errors.
 */
var queryApi = function(options, callback) {
    http.get(options, function(res) {
            var data = '';
        
        // iteratively build up the data
        res.on('data', function(chunk) {
            data += chunk;
        });
        
        // when complete, continue
        res.on('end', function() {
            var result = JSON.parse(data);

            if (result.ErrorCode !== ErrorCodeType.SUCCESS) {
                // call as error
                callback({
                    code: result.ErrorCode,
                    status: result.ErrorStatus
                });
            } else {
                // call success
                callback(null, result.Response);
            };
        });
    }).on('error', function(e) {
        callback({
            status: e
        });
    });
};

// enum defining the result codes
var ErrorCodeType = BungieApi.ErrorCodeType = {
    SUCCESS: 1
};

module.exports = BungieApi;