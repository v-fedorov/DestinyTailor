var config = require('../config/'),
    extend = require('extend'),
    Inventory = require('../models/inventory'),
    ItemFormatter = require('./formatters/itemFormatter'),
    NodeCache = require('node-cache'),
    util = require('util'),
    http = require('http');

// enum defining the result codes
var ErrorCodeType = Bungie.ErrorCodeType = {
    SUCCESS: 1
};

// declare the item cache
var itemCache = new NodeCache(config.cache);

/**
 * Constructs a new service for querying Bungie.NET.
 * @constructor
 */
function Bungie() { };

/**
 * Gets the character information from Bungie.
 * @param {number} platform The platform of the character.
 * @param {string} membershipId The membership id the character is on.
 * @param {string} characterId The character id.
 * @param {function} callback The callback triggered when the character has loaded; result is a character.
 */
Bungie.prototype.getCharacter = function(platform, membershipId, characterId, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/', platform, membershipId, characterId),
        requestOptions = this.getRequestOptions(path);
        
    this.request(requestOptions, function(err, result) {
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
Bungie.prototype.getInventory = function(platform, membershipId, characterId, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/Inventory/Summary/?definitions=true', platform, membershipId, characterId),
        requestOptions = this.getRequestOptions(path);

    this.request(requestOptions, function(err, result) {
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
Bungie.prototype.getInventoryItem = function(platform, membershipId, characterId, itemId, callback, options) {
    var _this = this,
        options = extend({}, {
            lightLevel: undefined
        }, options);

    if (itemId && options.lightLevel) {
        // check if we have the item cached locally before making a request
        var cacheKey = getInventoryItemCacheKey(itemId, options.lightLevel);
        itemCache.get(cacheKey, function(err, value) {
            // check if we can return the value, or if we have to load it externally
            if (err || value) {
                return callback(err, value);
            };

            // as we don't have the item, lets load it
            _this.requestInventoryItem(platform, membershipId, characterId, itemId, function(err, item) {
                if (err) {
                    return callback(err);
                }
                
                // attempt to set the cache as we now have an item
                cacheKey = getInventoryItemCacheKey(item.itemId, item.lightLevel);
                itemCache.set(cacheKey, item, function(err, success) {
                    callback(err, item);
                });
            });
        });
    } else {
        this.requestInventoryItem(platform, membershipId, characterId, itemId, callback); 
    };
};

/**
 * Gets the item information for a given item instance id from Bungie.
 * @param {number} platform The platform of the character.
 * @param {string} membershipId The membership id the character is on.
 * @param {string} characterId The character id.
 * @param {string} itemId The item instance id.
 * @param {function} callback The callback trigger when the item has loaded.
 */
Bungie.prototype.requestInventoryItem = function(platform, membershipId, characterId, itemId, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/Inventory/%s/?definitions=true', platform, membershipId, characterId, itemId),
        requestOptions = this.getRequestOptions(path);

    this.request(requestOptions, function(err, result) {
        if (err !== null) {
            return callback(err);
        }
        
        // format the item
        var itemFormatter = new ItemFormatter(platform, membershipId, characterId),
            item = itemFormatter.getItem(result.data, result.definitions);
        
        callback(null, item);
    });
}

/**
 * Gets the default options for making a request to the Bungie API.
 * @param {string} path The path to be used within the options.
 * @returns {object} The options.
 */
Bungie.prototype.getRequestOptions = function(path) {
    return {
        host: 'www.bungie.net',
        port: '80',
        path: path,
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': config.apiKey
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

/**
 * Gets the cache key for a given item by it's instance id and light level.
 * @param {number} id The item's unique id.
 * @param {number} lightLevel The light level on the item.
 * @returns The key.
 */
var getInventoryItemCacheKey = function(id, lightLevel) {
    return id + '/' + lightLevel;
}

module.exports = Bungie;