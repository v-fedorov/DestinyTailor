var config = require('../config'),
    extend = require('extend'),
    Inventory = require('../models/inventory'),
    ItemFormatter = require('./itemFormatter'),
    NodeCache = require('node-cache'),
    util = require('util'),
    http = require('http');

// declare the item cache
var itemCache = new NodeCache(config.cache);

/**
 * Constructs a new service for querying Bungie.NET.
 * @constructor
 */
function BungieService() { };

// enum defining the result codes
var ErrorCodeType = BungieService.ErrorCodeType = {
    SUCCESS: 1
};

/**
 * Gets the character information from Bungie.
 * @param {number} platform The platform of the character.
 * @param {string} membershipId The membership id the character is on.
 * @param {string} characterId The character id.
 * @param {function} callback The callback triggered when the character has loaded; result is a character.
 */
BungieService.prototype.getCharacter = function(platform, membershipId, characterId, callback) {
    var path = util.format('/%s/Account/%s/Character/%s/', platform, membershipId, characterId);
    this.request(path, function(err, result) {
        callback(err, result.data);
    });
};

/**
 * Gets the character's inventory from Bungie.
 * @param {number} platform The platform of the character.
 * @param {string} membershipId The membership id the character is on.
 * @param {string} characterId The character id.
 * @param {function} callback The callback triggered when the inventory has loaded.
 */
BungieService.prototype.getInventory = function(platform, membershipId, characterId, callback) {
    var path = util.format('/%s/Account/%s/Character/%s/Inventory/Summary/?definitions=true', platform, membershipId, characterId);
    this.request(path, function(err, result) {
        if (err) {
            return callback(err);
        };

        // construct the inventory with the basic information
        var itemFormatter = new ItemFormatter(platform, membershipId, characterId),
            inventory = new Inventory();

        result.data.items.forEach(function(itemData) {
            var item = itemFormatter.getItem({ item: itemData }, result.definitions);
            inventory.setItem(item);
        });

        // finally expand the inventories information to include instance based data
        inventory.expand(callback);
    });
};

/**
 * Gets the item information.
 * @param {number} platform The platform of the character.
 * @param {string} membershipId The membership id the character is on.
 * @param {string} characterId The character id.
 * @param {string} itemId The item instance id.
 * @param {function} callback The callback triggered when the item has loaded.
 * @param {object} options The optional information.
 */
BungieService.prototype.getInventoryItem = function(platform, membershipId, characterId, itemId, callback, options) {
    var lightLevel = extend({ lightLevel: undefined }, options).lightLevel;

    // check if we have the item cached locally before making a request
    itemCache.get(itemId + '|' + lightLevel, function(err, value) {
        // check if we can return the value, or if we have to load it externally
        if (err || value) {
            return callback(err, value);
        };

        var path = util.format('/%s/Account/%s/Character/%s/Inventory/%s/?definitions=true', platform, membershipId, characterId, itemId);
        this.request(path, function(err, result) {
            if (err !== null) {
                return callback(err);
            }

            // format the item
            var itemFormatter = new ItemFormatter(platform, membershipId, characterId),
                item = itemFormatter.getItem(result.data, result.definitions);

            // attempt to set the cache as we now have an item
            itemCache.set(itemId + '|' + lightLevel, item, function(err, success) {
                callback(err, item);
            });
        });
    }.bind(this));
};

/**
 * Searches for the account for the given platform.
 * @param {number} platform The platform to search on; either Xbox (1) or PSN (2).
 * @param {string} displayName The account's display name.
 * @param {function} callback The callback triggered when the search has completed.
 */
BungieService.prototype.searchCharacter = function(platform, displayName, callback) {
    var path = util.format('/SearchDestinyPlayer/%s/%s/', platform, displayName),
        requestOptions = this.getRequestOptions(path);

    this.request(requestOptions, callback);
};

/**
 * Gets the default options for making a request to the Bungie API.
 * @param {string} methodPath The path to the method to be used within the options.
 * @returns {object} The options.
 */
BungieService.prototype.getRequestOptions = function(methodPath) {
    return {
        host: 'www.bungie.net',
        port: '80',
        path: '/Platform/Destiny' + methodPath,
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': config.apiKey
        }
    };
};

/**
 * Makes a get request to the Bungie API with the specified options.
 * @param {object|string} options The request options or path.
 * @param {function} callback The callback used when the request finishes, or errors.
 */
BungieService.prototype.request = function(options, callback) {
    var requestOptions = typeof options === 'string'
        ? this.getRequestOptions(options)
        : options;

    http.get(requestOptions, function(res) {
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

module.exports = BungieService;