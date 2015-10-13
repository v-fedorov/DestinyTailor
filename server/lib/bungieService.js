var config = require('../config'),
    Inventory = require('../models/inventory'),
    Item = require('../models/item'),
    itemStatMapper = require('./itemStatMapper'),
    NodeCache = require('node-cache'),
    util = require('util'),
    http = require('http');

// main export
var bungieService = module.exports = {};

// declare the item cache and enumerations
var itemCache = new NodeCache(config.cache),
    ErrorCodeType = bungieService.ErrorCodeType = {
        SUCCESS: 1
    };

/**
 * Gets the character information from Bungie.
 * @param {number} platform The platform of the character.
 * @param {string} membershipId The membership id the character is on.
 * @param {string} characterId The character id.
 * @param {function} callback The callback triggered when the character has loaded; result is a character.
 */
bungieService.getCharacter = function(platform, membershipId, characterId, callback) {
    var path = util.format('/%s/Account/%s/Character/%s/', platform, membershipId, characterId);
    request(path, function(err, result) {
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
bungieService.getInventory = function(platform, membershipId, characterId, callback) {
    var path = util.format('/%s/Account/%s/Character/%s/Inventory/Summary/?definitions=true', platform, membershipId, characterId);
    request(path, function(err, result) {
        if (err) {
            return callback(err);
        };

        // construct the inventory and load the basic item information
        var inventory = new Inventory();
        result.data.items.forEach(function(data) {
            var item = new Item();
            item.itemId = data.itemId;
            item.name = result.definitions.items.hasOwnProperty(data.itemHash) ? result.definitions.items[data.itemHash].itemName : null;
            item.bucketHash = data.bucketHash;
            item.setLightLevel(data.primaryStat);
            item.expand = getStatMapperDelegate(platform, membershipId, characterId, item);

            inventory.setItem(item);
        });

        // finally expand the inventories information to include instance based data
        inventory.expand(callback);
    });
};

/**
 * Searches for the account for the given platform.
 * @param {number} platform The platform to search on; either Xbox (1) or PSN (2).
 * @param {string} displayName The account's display name.
 * @param {function} callback The callback triggered when the search has completed.
 */
bungieService.searchCharacter = function(platform, displayName, callback) {
    var path = util.format('/SearchDestinyPlayer/%s/%s/', platform, displayName);
    request(path, callback);
};

/**
 * Gets the item delegate used to expand the item stats.
 * @param {number} platform The platform of the character.
 * @param {string} membershipId The membership id the character is on.
 * @param {string} characterId The character id.
 * @param {string} item The item.
 */
var getStatMapperDelegate = function(platform, membershipId, characterId, item) {
    return function(callback) {
        // check if we have the item cached locally before making a request
        itemCache.get(item.itemId + '|' + item.lightLevel, function(err, value) {
            // check if we can return the value, or if we have to load it externally
            if (err || value) {
                return callback(err, value);
            };

            var path = util.format('/%s/Account/%s/Character/%s/Inventory/%s/?definitions=true', platform, membershipId, characterId, item.itemId);
            request(path, function(err, result) {
                if (err !== null) {
                    return callback(err);
                }

                // map the stats and cache the item
                itemStatMapper.map(result.data, item);
                itemCache.set(item.itemId + '|' + item.lightLevel, item, function(err, success) {
                    callback(err, item);
                });
            });
        });
    };
};

/**
 * Gets the default options for making a request to the Bungie API.
 * @param {string} methodPath The path to the method to be used within the options.
 * @returns {object} The options.
 */
var getRequestOptions = function(methodPath) {
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
var request = function(options, callback) {
    var requestOptions = typeof options === 'string'
        ? getRequestOptions(options)
        : options;

    // log how long each request takes
    var timeLabel = '> GET ' + requestOptions.path;
    console.time(timeLabel);

    // make the request
    http.get(requestOptions, function(res) {
            var data = '';

        // iteratively build up the data
        res.on('data', function(chunk) {
            data += chunk;
        });

        // when complete, continue
        res.on('end', function() {
            console.timeEnd(timeLabel);
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
        console.timeEnd(timeLabel);
        callback({
            status: e
        });
    });
};
