(function() {
    'use strict';

    angular.module('main').factory('inventoryService', InventoryService);
    InventoryService.$inject = ['InventoryAnalysis'];

    /**
     * Defines the inventory analyser service.
     * @param {Object} InventoryAnalysis The constructor for an inventory analysis.
     * @returns {Object} The inventory service.
     */
    function InventoryService(InventoryAnalysis) {
        return {
            // functions
            getStatProfiles: getStatProfiles
        };

        /**
         * Gets the unique stat profiles for the given character.
         * @param {Object} character The character to analyse.
         */
        function getStatProfiles(character) {
            var analysis = new InventoryAnalysis(character);
            return analysis.profiles;
        }
    }
})();
