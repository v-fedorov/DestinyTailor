var BungieService = require('../lib/bungieService'),
    Character = require('../models/character'),
    express = require('express'),
    extend = require('extend'),
    router = express.Router();

/*
    testing:

    http://localhost:3000/psn/4611686018437908853/2305843009230541270
    itemId 6917529062061291933
*/

var bungieService = new BungieService();

/**
 * [GET] Searches for the character on the given platform.
 */
router.get('/search/:platform/:displayName', function(req, res, next) {
    var callback = getResponseHandler(res);
    bungieService.searchCharacter(req.params.platform, req.params.displayName, callback);
});

/**
 * [GET] Gets the character information.
 */
router.get('/:platform/:membershipId/:characterId', function(req, res, next) {
    var callback = getResponseHandler(res);
    bungieService.getCharacter(req.params.platform, req.params.membershipId, req.params.characterId, callback);
});

/**
 * [GET] Gets the inventory information for the character.
 */
router.get('/:platform/:membershipId/:characterId/inventory', function(req, res, next) {
    var callback = getResponseHandler(res);
    bungieService.getInventory(req.params.platform, req.params.membershipId, req.params.characterId, callback);
});

/**
 * [GET] Gets the instance specific item information for the given character.
 */
router.get('/:platform/:membershipId/:characterId/inventory/:itemId', function(req, res, next) {
    var callback = getResponseHandler(res);
    bungieService.getInventoryItem(req.params.platform, req.params.membershipId, req.params.characterId, req.params.itemId, callback);
});

/**
 * Gets a response handler callback delegate for a Bungie service method.
 * @param {object} res The response from the router.
 * @returns The method callback handler.
 */
var getResponseHandler = function(res) {
    // construct the handler
    return function(err, result) {
        if (err) {
            res.status(err.code).send(err.message);
        } else {
            res.json(result);
        };
    };
};

module.exports = router;
