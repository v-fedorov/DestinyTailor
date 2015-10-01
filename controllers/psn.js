var bungieApiService = require('../lib/bungieService'),
    Character = require('../models/character'), 
    express = require('express'),
    router = express.Router();

// [GET] psn character
router.get('/:accountId/:characterId', function(req, res, next) {
    // test: http://localhost:3000/psn/4611686018437908853/2305843009230541270
    
    var character = new Character(2, req.params.accountId, req.params.characterId);
    /*bungieApiService.getCharacter(character, function(err, char) {
        res.json(char);
    });*/
    
    bungieApiService.getInventoryItem(character, '6917529062061291933', function(err, item) {
       res.json(item); 
    });
});

module.exports = router;
