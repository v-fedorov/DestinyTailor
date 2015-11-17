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
    ERROR_CODE_TYPE = bungieService.ERROR_CODE_TYPE = {
        success: 1
    },
    MEMBERSHIP_TYPE = bungieService.MEMBERSHIP_TYPE = {
        xbox: 1,
        psn: 2
    };

/**
 * Gets the character's inventory from Bungie.
 * @param {Number} membershipType The membership type of the character.
 * @param {String} membershipId The membership id the character is on.
 * @param {String} characterId The character id.
 * @param {Function} callback The callback triggered when the inventory has loaded.
 */
bungieService.getInventory = function(membershipType, membershipId, characterId, callback) {
    var path = util.format('/%s/Account/%s/Character/%s/Inventory/Summary/?definitions=true', membershipType, membershipId, characterId);
    request(path, function(err, result) {
        if (err) {
            return callback(err);
        };

        // construct the inventory and load the basic item information
        var inventory = new Inventory();
        result.data.items.forEach(function(data) {
            var item = new Item(data, result.definitions);
            item.expand = getStatMapperDelegate(membershipType, membershipId, characterId, item);

            inventory.setItem(item);
        });

        // finally expand the inventories information to include instance based data
        inventory.expand(callback);
    });
};

/**
 * Gets the item delegate used to expand the item stats.
 * @param {Number} membershipType The membership type of the character.
 * @param {String} membershipId The membership id the character is on.
 * @param {String} characterId The character id.
 * @param {String} item The item.
 */
var getStatMapperDelegate = function(membershipType, membershipId, characterId, item) {
    return function(callback) {
        // check if we have the item cached locally before making a request
        itemCache.get(item.itemId + '|' + item.lightLevel, function(err, cachedValue) {
            if (err) {
                return callback(err);
            }

            // check if we have a cached value, if we do, map the stats
            if (cachedValue) {
                itemStatMapper.map(cachedValue, item);
                return callback(null, cachedValue);
            };

            // otherwise load the stats from Bungie
            var path = util.format('/%s/Account/%s/Character/%s/Inventory/%s/?definitions=true', membershipType, membershipId, characterId, item.itemId);
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
 * @param {String} methodPath The path to the method to be used within the options.
 * @returns {Object} The options.
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
 * @param {Object|String} options The request options or path.
 * @param {Function} callback The callback used when the request finishes, or errors.
 */
var request = function(options, callback) {
    var requestOptions = typeof options === 'string'
        ? getRequestOptions(options)
        : options;

    // log how long each request takes
    var timeLabel = '> GET BUNGIE ' + requestOptions.path;
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
                if (result.ErrorCode !== ERROR_CODE_TYPE.success) {
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
