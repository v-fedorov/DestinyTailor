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
         * @param {String} displayName The account's display name.
         * @returns {Object} The characters, represented as a promise.
         */
        $scope.getCharacters = function(membershipType, displayName) {
            return $q(function(resolve, reject) {
                // get the membership information
                getMembership(membershipType, displayName).then(function(membership) {
                    $http.get('/Platform/Destiny/' + membership.membershipType + '/Account/' + membership.membershipId + '/?definitions=true').then(function(result) {
                        // set the characters and definitions
                        var characters = result.data.Response.data.characters;
                        var definitions = result.data.Response.definitions;

                        // map the character information
                        for (var i = 0; i < characters.length; i++) {
                            characters[i] = new Character(characters[i], definitions);
                            characters[i].membershipType = membership.membershipType;
                            characters[i].membershipId = membership.membershipId;
                        }

                        resolve(characters);
                    }, function(err) {
                        reject(err);
                    });
                }, function(err) {
                    reject(err);
                });
            });
        };

        /**
         * Selects the character, updating the current $scope.
         * @param {String} characterId The character to select.
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
            $http.get('/api/' + character.membershipType + '/' + character.membershipId + '/' + character.characterId).then(function(result) {
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

        /**
         * Gets the membership information for the given type and display name.
         * @param {Number} membershipType The type that represents the platform, e.g. 1 for Xbox, or 2 for PSN.
         * @param {String} displayName The account's display name.
         * @returns {Object} The membership, represented as a promise.
         */
        function getMembership(membershipType, displayName) {
            return $q(function(resolve, reject) {
                $http.get('/Platform/Destiny/SearchDestinyPlayer/' + membershipType + '/' + displayName + '/').then(function(result) {
                    // success when we have at least 1 character; we should only ever have 1...
                    if (result.data.Response !== null && result.data.Response.length === 1) {
                        resolve(result.data.Response[0]);
                    } else {
                        reject({ statusText: "Character not found" });
                    }
                }, function(err) {
                    reject(err);
                });
            });
        }

        return $scope;
    }]);
})(angular.module('main'));
