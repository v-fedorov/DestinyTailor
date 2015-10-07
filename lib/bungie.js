var Character = require('../models/character'),
    config = require('../config/'),
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
 * @param {object} params The parameters, including platform, account id, and character id.
 * @param {function} callback The callback triggered when the character has loaded; result is a character.
 */
Bungie.prototype.getCharacter = function(params, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/', params.platform, params.accountId, params.characterId),
        options = this.getOptions(path);
        
    this.request(options, function(err, result) {
        callback(err, result.data);
    });
};

/**
 * Gets the character's inventory from Bungie.
 * @param {object} params The parameters, including platform, account id, and character id.
 * @param {function} callback The callback triggered when the inventory has loaded.
 */
Bungie.prototype.getInventory = function(params, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/Inventory/Summary/?definitions=true', params.platform, params.accountId, params.characterId),
        options = this.getOptions(path);

    this.request(options, function(err, result) {
        if (err) {
            return callback(err);
        };

        // construct the inventory with the basic information
        var itemFormatter = new ItemFormatter(),
            inventory = new Inventory();
            
        result.data.items.forEach(function(item) {
            inventory.setItem(itemFormatter.getItem(params, item, result.definitions));
        });
        
        // finally expand the inventories information to include instance based data
        inventory.expand(callback);
    });
};

/**
 * Gets the item information.
 * @param {object} params The parameters, including platform, account id, character id and item id.
 * @param {function} callback The callback triggered when the item has loaded.
 */
Bungie.prototype.getInventoryItem = function(params, callback) {
    var _this = this;
    if (params.itemId && params.lightLevel) {
        // check if we have the item cached locally before making a request
        var cacheKey = getInventoryItemCacheKey(params.itemId, params.lightLevel);
        itemCache.get(cacheKey, function(err, value) {
            if (err) {
                return callback(err);
            };
            
            // check if we can return the value, or if we have to load it externally
            if (value !== undefined) {
                return callback(null, value);
            }
            
            // as we don't have the item, lets load it
            _this.requestInventoryItem(params, function(err, item) {
                if (err) {
                    return callback(err);
                }
                
                // attempt to set the cache as we now have an item
                cacheKey = getInventoryItemCacheKey(item.itemId, item.lightLevel);
                itemCache.set(cacheKey, item, function(err, success) {
                    callback(err, item);
                })
            });
        });
    } else {
       this.requestInventoryItem(params, callback); 
    };
};

/**
 * Gets the item information for a given item instance id from Bungie.
 * @param {object} params The parameters, including platform, account id, character id and item id.
 * @param {function} callback The callback trigger when the item has loaded.
 */
Bungie.prototype.requestInventoryItem = function(params, callback) {
    var path = util.format('/Platform/Destiny/%s/Account/%s/Character/%s/Inventory/%s/?definitions=true', params.platform, params.accountId, params.characterId, params.itemId),
        options = this.getOptions(path);
        
    this.request(options, function(err, result) {
        if (err !== null) {
            return callback(err);
        }
        
        // format the item
        var itemFormatter = new ItemFormatter(),
            item = itemFormatter.getItem(params, result.data.item, result.definitions);
        
        callback(null, item);
    });
}

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