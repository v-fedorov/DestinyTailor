(function() {
    'use strict';

    var app = angular.module('destinyTailorApp', ['ngRoute']);

    // platform
    app.constant('PLATFORM', {
        psn: 2,
        xbox: 1
    });

    // stat names
    app.constant('STAT_NAMES', [
        'intellect',
        'discipline',
        'strength'
    ]);

    // cooldown tiers for abilities
    app.constant('ABILITY_COOLDOWNS', {
        /* defender, nightstalker, striker, and sunsinger */
        supersFast:  ['5:00', '4:46', '4:31', '4:15', '3:58', '3:40'],
        /* bladedancer, gunslinger, stormcaller, sunbreaker, and voidwalker */
        supersSlow:  ['5:30', '5:14', '4:57', '4:39', '4:20', '4:00'],
        grendade:    ['1:00', '0:55', '0:49', '0:42', '0:34', '0:25'],
        melee:       ['1:00', '0:55', '0:49', '0:42', '0:34', '0:25']
    });

    // configure our routes
    app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $routeProvider
            .when('/', {
                templateUrl: '/js/pages/index.html'
            })
            .when('/:platform/:name', {
                templateUrl: '/js/pages/index.html'
            });
    }]);
})();
