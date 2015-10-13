var bungieService = require('../lib/bungieService'),
    express = require('express'),
    extend = require('extend'),
    router = express.Router();

/*
    testing:

    http://localhost:3000/2/4611686018437908853/2305843009230541270
    itemId 6917529062061291933
*/

/**
 * [GET] Searches for the character on the given platform.
 */
router.get('/:platformName/:displayName', function(req, res, next) {
    // validate platform name
    if (!bungieService.PLATFORM_TYPE.hasOwnProperty(req.params.platformName)) {
        res.status(400).send('Invalid platform name');
        return;
    }

    bungieService.searchCharacter(bungieService.PLATFORM_TYPE[req.params.platformName], req.params.displayName, function(err, result) {
        if (err) {
            return res.status(err.code).send('Error ' + err.code + ': ' + err.message);
        }

        res.json(result);
    });
});

/**
 * [GET] Gets the inventory information for the character.
 */
router.get('/:platform/:membershipId/:characterId', function(req, res, next) {
    var callback = getResponseHandler(res);
    bungieService.getInventory(req.params.platform, req.params.membershipId, req.params.characterId, callback);
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
            res.json(result);
        };
    };
};

module.exports = router;
