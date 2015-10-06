var Bungie = require('../lib/bungie'),
    Character = require('../models/character'), 
    express = require('express'),
    router = express.Router();

/*
    testing:
    
    http://localhost:3000/psn/4611686018437908853/2305843009230541270
    itemId 6917529062061291933
*/
 
var bungieService = new Bungie();

/**
 * [GET] Loads the inventory item for the given character.
 * @param {string} accountId The account id.
 * @param {string} characterId The character id.
 */
router.get('/:accountId/:characterId', function(req, res, next) {
    bungieService.getCharacter(2, req.params.accountId, req.params.characterId, getResponseHandler(res));
});

/**
 * [GET] Loads the inventory item for the given character.
 * @param {string} accountId The account id.
 * @param {string} characterId The character id.
 */
router.get('/:accountId/:characterId/inventory', function(req, res, next) {
    bungieService.getInventory(2, req.params.accountId, req.params.characterId, getResponseHandler(res));
});

/**
 * [GET] Loads the inventory item for the given character.
 * @param {string} accountId The account id.
 * @param {string} characterId The character id.
 * @param {string} itemId The instance item id.
 */
router.get('/:accountId/:characterId/inventory/:itemId', function(req, res, next) {
    bungieService.getInventoryItem(2, req.params.accountId, req.params.characterId, req.params.itemId, getResponseHandler(res));
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
