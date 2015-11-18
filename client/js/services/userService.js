(function(app) {
    'use strict';

    /**
     * The user service, primarily used to share the current membership, and selected character.
     * @param {Object} $http The http utils from Angular.
     * @param {Object} $q Service helper for running function asynchronously.
     * @param {Object} Character The character model.
     * @returns {Object} The user service.
     */
    app.factory('userService', ['$http', '$q', 'Character', function($http, $q, Character) {
        var $scope = {
            account: null,
            character: null
        };

        /**
         * Gets the characters for a given membership type (platform), and display name.
         * @param {Number} membershipType The type that represents the platform, e.g. 1 for Xbox, or 2 for PSN.
         * @param {String} membershipId The membership id.
         * @returns {Object} The characters, represented as a promise.
         */
        $scope.getCharacters = function(membershipType, membershipId) {
            var path = '/Platform/Destiny/' + membershipType + '/Account/' + membershipId + '/';
            return $http.get(path).then(function(result) {
                // reject as there was an error from Bungie
                if (result.data.ErrorCode > 1) {
                    throw result.data.Message;
                }

                // resolve the mapped characters
                return result.data.Response.data.characters.map(function(data) {
                    return new Character(membershipType, membershipId, data);
                });
            });
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
                // success when we have at least 1 character; we should only ever have 1...
                if (result.data.Response !== undefined && result.data.Response.length === 1) {
                    return result.data.Response[0];
                }

                throw 'Character not found';
            });
        };

        /**
         * Selects the character, updating the current $scope.
         * @param {Object} character The character to select.
         */
        $scope.selectCharacter = function(character) {
            // validate the character exists on the account
            if (!character) {
                return;
            }

            // check if the character already has inventory
            if (character.inventory) {
                $scope.character = character;
                return;
            }

            // otherwise load it
            var path = '/api/' + character.membershipType + '/' + character.membershipId + '/' + character.characterId;
            $http.get(path).then(function(result) {
                if (result.data === null) {
                    throw 'todo: No data.';
                } else {
                    character.inventory = result.data;
                    $scope.character = character;
                }
            }, function(err) {
                throw err;
            });
        };

        return $scope;
    }]);
})(angular.module('main'));
