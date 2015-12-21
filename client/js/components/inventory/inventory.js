(function() {
    'use strict';

    angular.module('main').directive('geInventory', inventory);
    inventory.$inject = ['TEMPLATE_URLS'];

    /**
     * Defines a directive for showing a character's complete inventory.
     * @param {Object} TEMPLATE_URLS The template Urls constant.
     * @returns {Object} The directive.
     */
    function inventory(TEMPLATE_URLS) {
        return {
            restrict: 'AE',
            scope: {
                inventory: '=ngInventory',
                statProfile: '=ngStatProfile'
            },
            templateUrl: TEMPLATE_URLS.components.inventory
        };
    }
})();
