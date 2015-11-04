(function() {
    'use strict';

    var app = angular.module('destinyTailorApp', []);

    // stat names
    app.constant('STAT_NAMES', [
        'intellect',
        'discipline',
        'strength'
    ]);

    // cooldown tiers for abilities
    app.constants('ABILITY_COOLDOWNS', {
        supersFast:  ['5:00', '4:46', '4:31', '4:15', '3:58', '3:40'], /* defender, nightstalker, striker, and sunsinger */
        supersSlow:  ['5:30', '5:14', '4:57', '4:39', '4:20', '4:00'], /* bladedancer, gunslinger, stormcaller, sunbreaker, and voidwalker */
        grendade:    ['1:00', '0:55', '0:49', '0:42', '0:34', '0:25'],
        melee:       ['1:00', '0:55', '0:49', '0:42', '0:34', '0:25']
    });
})();
