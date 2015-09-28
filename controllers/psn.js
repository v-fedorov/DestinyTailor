var bungieApiService = require('../lib/bungieApiService'), 
    express = require('express'),
    router = express.Router();

// [GET] psn character
router.get('/:accountId/:characterId', function(req, res, next) {
    // test: http://localhost:3000/psn/4611686018437908853/2305843009230541270
    
    bungieApiService.getCharacter(2, req.params.accountId, req.params.characterId, function(r) {
        res.json(r);
    });
});

module.exports = router;
