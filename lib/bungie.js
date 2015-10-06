var CharacterFormatter = require('./formatters/characterFormatter'),
    config = require('../config/'),
    ItemFormatter = require('./formatters/itemFormatter'),
    util = require('util'),
    http = require('http');

/**
 * Constructs a new service for querying Bungie.NET.
 * @constructor
 */
function Bungie() { };

/**
 * Gets the character information from Bungie.
 * @param {object} character An object containing the basic identifiers to select the character.
 * @param {function} callback The callback triggered when the character has loaded; result is a character.
 */
Bungie.prototype.getCharacter = function(character, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/', character.platform, character.accountId, character.id),
        options = this.getOptions(path);
        
    this.request(options, function(err, result) {
        if (err !== null) {
            return callback(err);
        };
        
        // build the character information
        var characterFormatter = new CharacterFormatter(result.definitions);
        characterFormatter.buildCharacter(character, result.data, callback);
    });
};

/**
 * Gets the character's inventory from Bungie.
 * @param {object} character An object containing the basic indentifiers.
 * @param {function} callback The callback triggered when the inventory has loaded.
 */
Bungie.prototype.getInventory = function(character, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/Inventory/Summary/?definitions=true', character.platform, character.accountId, character.id),
        options = this.getOptions(path);
        
    this.request(options, function(err, result) {
        callback(err, result);
    });
};

/**
 * Gets the item information from Bungie.
 * @param {object} character The character.
 * @param {number} itemId The instanced item's id.
 * @param {function} callback The callback triggered when the item has loaded.
 */
Bungie.prototype.getInventoryItem = function(character, itemId, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/Inventory/%s/?definitions=true', character.platform, character.accountId, character.id, itemId),
        options = this.getOptions(path);
        
    this.request(options, function(err, result) {
        if (err !== null) {
            return callback(err);
        }
        
        // format the item
        var itemFormatter = new ItemFormatter();
        callback(null, itemFormatter.getItem(result.data, result.definitions));
    });
};

/**
 * Gets the default options for making a request to the Bungie API.
 * @param {string} path The path to be used within the options.
 * @returns {object} The options.
 */
Bungie.prototype.getOptions = function(path) {
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
Bungie.prototype.request = function(options, callback) {
    http.get(options, function(res) {
            var data = '';
        
        // iteratively build up the data
        res.on('data', function(chunk) {
            data += chunk;
        });
        
        // when complete, continue
        res.on('end', function() {
            // check if the result was successful
            if (this.statusCode !== 200) {
                callback({
                    code: this.statusCode,
                    message: this.statusMessage
                });
            } else {
                var result = JSON.parse(data);
                if (result.ErrorCode !== ErrorCodeType.SUCCESS) {
                    // call as error
                    callback({
                        code: result.ErrorCode,
                        message: result.Message
                    }, null);
                } else {
                    // call success
                    callback(null, result.Response);
                };
            };
        });
    }).on('error', function(e) {
        callback({
            status: e
        });
    });
};

// enum defining the result codes
var ErrorCodeType = Bungie.ErrorCodeType = {
    SUCCESS: 1
};

module.exports = Bungie;