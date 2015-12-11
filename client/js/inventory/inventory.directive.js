(function(app) {
    'use strict';

    angular.module('main').directive('geInventory', inventory);

    /**
     * Defines a directive for showing a character's complete inventory.
     * @returns {Object} The directive.
     */
    function inventory() {
        return {
            restrict: 'AE',
            scope: {
                inventory: '=ngInventory',
                statProfile: '=ngStatProfile'
            },
            templateUrl: 'js/inventory/inventory.html'
        };
    }
})();
