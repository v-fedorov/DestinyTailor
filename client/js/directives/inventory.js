(function(app) {
    'use strict';
    
    angular.module('main').directive('geInventory', Inventory)

    /**
     * Defines a directive for showing a character's complete inventory.
     */
    function Inventory() {
        return {
            restrict: 'AE',
            scope: {
                inventory: '=ngInventory',
                statProfile: '=ngStatProfile'
            },
            templateUrl: 'js/views/inventory.html'
        }
    }
})();
