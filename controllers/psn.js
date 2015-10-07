var Bungie = require('../lib/bungie'),
    Character = require('../models/character'), 
    express = require('express'),
    extend = require('extend'),
    router = express.Router();

/*
    testing:
    
    http://localhost:3000/psn/4611686018437908853/2305843009230541270
    itemId 6917529062061291933
*/
 
var bungieService = new Bungie();

/**
 * [GET] Gets the character information.
 */
router.get('/:membershipId/:characterId', function(req, res, next) {
    var callback = getResponseHandler(res);
    bungieService.getCharacter(2, req.params.membershipId, req.params.characterId, callback);
});

/**
 * [GET] Gets the inventory information for the character.
 */
router.get('/:membershipId/:characterId/inventory', function(req, res, next) {
    var callback = getResponseHandler(res);
    bungieService.getInventory(2, req.params.membershipId, req.params.characterId, callback);
});

/**
 * [GET] Gets the instance specific item information for the given character.
 */
router.get('/:membershipId/:characterId/inventory/:itemId', function(req, res, next) {
    var callback = getResponseHandler(res);
    bungieService.getInventoryItem(2, req.params.membershipId, req.params.characterId, req.params.itemId, callback);
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
