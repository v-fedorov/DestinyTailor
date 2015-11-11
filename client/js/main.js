(function() {
    'use strict';

    var app = angular.module('main', []);

    // cooldown tiers for abilities
    app.constant('ABILITY_COOLDOWNS', {
        /* defender, nightstalker, striker, and sunsinger */
        supersFast:  ['5:00', '4:46', '4:31', '4:15', '3:58', '3:40'],
        /* bladedancer, gunslinger, stormcaller, sunbreaker, and voidwalker */
        supersSlow:  ['5:30', '5:14', '4:57', '4:39', '4:20', '4:00'],
        grendade:    ['1:00', '0:55', '0:49', '0:42', '0:34', '0:25'],
        melee:       ['1:00', '0:55', '0:49', '0:42', '0:34', '0:25']
    });

    // item bucket hash
    app.constant('ITEM_BUCKET_HASHES', {
        '434908299': 'artifact',
        '14239492': 'chest',
        '1585787867': 'classItem',
        '3551918588': 'gauntlets',
        '4023194814': 'ghost',
        '953998645': 'heavyWeapon',
        '3448274439': 'helmet',
        '20886954': 'legs',
        '1498876634': 'primaryWeapon',
        '2465295065': 'specialWeapon',
    });

    // platform
    app.constant('PLATFORMS', {
        psn: 2,
        xbox: 1
    });

    // stat names
    app.constant('STAT_NAMES', [
        'intellect',
        'discipline',
        'strength'
    ]);
})();
