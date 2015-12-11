(function(app) {
    'use strict';

    /**
     * The user service, primarily used to share the current membership, and selected character.
     * @param {Object} $http The http utils from Angular.
     * @param {Object} $q Service helper for running function asynchronously.
     * @param {Object} Character The character model.
     * @param {Object} inventoryAnalyser The inventory analyser service.
     * @returns {Object} The user service.
     */
    app.factory('userService', ['$http', '$q', 'Character', 'inventoryAnalyser', function($http, $q, Character, inventoryAnalyser) {
        var $scope = {
            account: null,
            character: null
        };

        /**
         * Gets the membership information for the given type and display name.
         * @param {Number} membershipType The type that represents the platform, e.g. 1 for Xbox, or 2 for PSN.
         * @param {String} displayName The account's display name.
         * @returns {Object} The membership, represented as a promise.
         */
        $scope.getMembership = function(membershipType, displayName) {
            var path = '/Platform/Destiny/SearchDestinyPlayer/' + membershipType + '/' + encodeURIComponent(displayName) + '/';
            return $http.get(path).then(function(result) {
                // success when we have at least 1 membership; we should only ever have 1...
                if (result.data.Response !== undefined && result.data.Response.length === 1) {
                    return result.data.Response[0];
                }

                throw 'Character not found';
            });
        };

        /**
         * Loads the characters for the given membership.
         * @param {Object} membership The membership.
         * @returns {Object} The membership with the characters, represented as a promise.
         */
        $scope.loadCharacters = function(membership) {
            var path = '/Platform/Destiny/' + membership.membershipType + '/Account/' + membership.membershipId + '/';
            return $http.get(path).then(function(result) {
                // reject as there was an error from Bungie
                if (result.data.ErrorCode > 1) {
                    throw result.data.Message;
                }

                // resolve the mapped characters
                membership.characters = result.data.Response.data.characters.map(function(data) {
                    return new Character(membership, data);
                });

                return membership;
            });
        };

        /**
         * Selects the character, updating the current $scope.
         * @param {Object} character The character to select.
         */
        $scope.selectCharacter = function(character) {
            $scope.character = character;

            // load the inventory when its empty
            if (!character.inventory) {
                loadInventory(character)
                    .then(function(inventory) {
                        character.inventory = inventory;
                        character.statProfiles = inventoryAnalyser.getStatProfiles(character);
                    });
            }
        };

        /**
         * Updates the current loaded membership.
         * @param {Object} membership The membership.
         */
        $scope.setMembership = function(membership) {
            $scope.character = null;
            $scope.account = membership;
        };

        /**
         * Loads the inventory for the given character.
         * @param {Object} character The character.
         * @returns {Object} A promise, that is fulfilled when the inventory has been loaded.
         */
        function loadInventory(character) {
            var path = '/api/' + character.membershipType + '/' + character.membershipId + '/' + character.characterId;
            return $http.get(path).then(function(result) {
                if (result.data !== null) {
                    return result.data;
                }

                throw 'Unable to load inveotry';
            });
        }

        return $scope;
    }]);
})(angular.module('main'));
