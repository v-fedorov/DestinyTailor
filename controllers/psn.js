var BungieService = require('../lib/bungieService'),
    Character = require('../models/character'), 
    express = require('express'),
    router = express.Router();

// [GET] psn character
router.get('/:accountId/:characterId', function(req, res, next) {
    // test: http://localhost:3000/psn/4611686018437908853/2305843009230541270
    
    var bungie = new BungieService();
    
    var character = new Character(2, req.params.accountId, req.params.characterId);
    bungie.getCharacter(character, function(err, char) {
        res.json(char);
    });
    
    // bungie.getInventoryItem(character, '6917529062061291933', function(err, item) {
    //    res.json(item); 
    // });
    
    // bungie.getInventory(character, function(err, result) {
    //     if (err) {
    //         res.status(err.code).send(err.message);
    //     } else {
    //         res.json(result);
    //     };
    // });
});

module.exports = router;
