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
 * Gets the route handler for the given Bungie method.
 * @param {string} methodName The name of the Bungie method to call.
 * @returns The route handler function.
 */
var getRouteHandler = function(methodName) {
    return function(req, res, next) {
        var params = extend({}, req.params, { platform: 2 });
        bungieService[methodName](params, getResponseHandler(res));
    };
}

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

// map the routes to the Bungie service
router.get('/:accountId/:characterId', getRouteHandler('getCharacter'));
router.get('/:accountId/:characterId/inventory', getRouteHandler('getInventory'));
router.get('/:accountId/:characterId/inventory/:itemId', getRouteHandler('getInventoryItem'));

module.exports = router;
