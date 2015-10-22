var bungieService = require('../lib/bungieService'),
    express = require('express'),
    extend = require('extend'),
    router = express.Router();

/*
    testing:

    http://localhost:3000/api/2/4611686018437908853/2305843009230541270
    itemId 6917529062061291933
*/

/**
 * [GET] Searches for the character on the given membership type.
 */
router.get('/:membershipType/:displayName', function(req, res, next) {
    var callback = getResponseHandler(res);
    bungieService.searchCharacter(req.params.membershipType, req.params.displayName, callback);
});

/**
 * [GET] Gets the inventory information for the character.
 */
router.get('/:membershipType/:membershipId/:characterId', function(req, res, next) {
    var callback = getResponseHandler(res);
    bungieService.getInventory(req.params.membershipType, req.params.membershipId, req.params.characterId, callback);
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
            res.status(err.code).send('Error ' + err.code + ': ' + err.message);
        } else {
            res.status(200).json(result);
        };
    };
};

module.exports = router;
