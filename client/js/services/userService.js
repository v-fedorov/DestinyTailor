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
            var deferred = $q.defer();

            // get the membership information
            $scope.getMembership(membershipType, displayName).then(function(membership) {
                var path = '/Platform/Destiny/' + membership.membershipType + '/Account/' + membership.membershipId + '/';
                $http.get(path).then(function(result) {
                    if (result.data.ErrorCode > 1) {
                        // reject as there was an error from Bungie
                        deferred.reject({
                            statusText: result.data.Message
                        });
                    } else {
                        // resolve the mapped characters
                        deferred.resolve(result.data.Response.data.characters.map(function(data) {
                            return new Character(membership, data);
                        }));
                    }
                });
            }, function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        /**
         * Gets the membership information for the given type and display name.
         * @param {Number} membershipType The type that represents the platform, e.g. 1 for Xbox, or 2 for PSN.
         * @param {String} displayName The account's display name.
         * @returns {Object} The membership, represented as a promise.
         */
        $scope.getMembership = function(membershipType, displayName) {
            var deferred = $q.defer();
            var path = '/Platform/Destiny/SearchDestinyPlayer/' + membershipType + '/' + encodeURIComponent(displayName) + '/';

            $http.get(path).then(function(result) {
                // success when we have at least 1 character; we should only ever have 1...
                if (result.data.Response !== undefined && result.data.Response.length === 1) {
                    deferred.resolve(result.data.Response[0]);
                } else {
                    deferred.reject({
                        statusText: 'Character not found'
                    });
                }
            }, function(err) {
                deferred.reject({
                    statusText: err.status === 404 ? 'Character not found' : 'Unknown error'
                });
            });

            return deferred.promise;
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
