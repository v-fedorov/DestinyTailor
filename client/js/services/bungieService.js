(function() {
    'use strict';

    angular.module('main').factory('bungieService', bungieService);
    bungieService.$inject = ['$http'];

    /**
     * Defines the Bungie service, used to communicate with Bungie.
     * @param {Object} $http The http helper from Angular.
     * @returns {Object} The inventory service.
     */
    function bungieService($http) {
        return {
            // functions
            getAccountSummary: getAccountSummary,
            getInventorySummary: getInventorySummary,
            getItemDetails: getItemDetails,
            searchDestinyPlayer: searchDestinyPlayer,

            // helpers
            throwErrors: throwErrors
        };

        /**
         * Gets the account summary for a membership.
         * @param {Number} membershipType The membership type; either 1 for xbox, or 2 for PSN.
         * @param {Number} membershipId The identifier for the membership.
         * @returns {Object} The result of requesting the account summary.
         */
        function getAccountSummary(membershipType, membershipId) {
            var path = '/Platform/Destiny/' + membershipType + '/Account/' + membershipId + '/';
            return $http.get(path);
        }

        /**
         * Gets the item detail for a given item instance.
         * @param {Number} membershipType The membership type; either 1 for xbox, or 2 for PSN.
         * @param {Number} membershipId The identifier for the membership.
         * @param {Number} characterId The identifier for the character.
         * @returns {Object} The result of requesting the inventory summary.
         */
        function getInventorySummary(membershipType, membershipId, characterId) {
            var path = '/Platform/Destiny/' + membershipType
                        + '/Account/' + membershipId
                        + '/Character/' + characterId
                        + '/Inventory/Summary/?definitions=true';

            return $http.get(path);
        }

        /**
         * Gets the item detail for a given item instance.
         * @param {Number} membershipType The membership type; either 1 for xbox, or 2 for PSN.
         * @param {Number} membershipId The identifier for the membership.
         * @param {Number} characterId The identifier for the character.
         * @param {Number} itemInstanceId The identifier for the item instance.
         * @returns {Object} The result of requesting the item details.
         */
        function getItemDetails(membershipType, membershipId, characterId, itemInstanceId) {
            var path = '/Platform/Destiny/' + membershipType
                        + '/Account/' + membershipId
                        + '/Character/' + characterId
                        + '/Inventory/' + itemInstanceId + '/';

            return $http.get(path);
        }

        /**
         * Handles any request errors.
         * @param {Object} result The API result to check.
         * @returns {Object} The API result.
         */
        function throwErrors(result) {
            // check the result status
            if (result.status !== 200) {
                throw 'Unable to connect to Bungie';
            }

            // accept if the error code is okay
            if (result.data.ErrorCode === 1) {
                return result;
            }

            throw result.data.Message;
        }

        /**
         * Searches for a Destiny membership by their membership type and display name.
         * @param {Number} membershipType The membership type; either 1 for xbox, or 2 for PSN.
         * @param {String} displayName The display name to search for.
         * @returns {Object} The result of the search.
         */
        function searchDestinyPlayer(membershipType, displayName) {
            var path = '/Platform/Destiny/SearchDestinyPlayer/' + membershipType + '/' + encodeURIComponent(displayName) + '/';
            return $http.get(path);
        }
    }
})();
