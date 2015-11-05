(function(app) {
    'use strict';

    /**
    * The user service, primarily used to share the current membership, and selected character.
    * @param {object} $http The http utils from Angular.
    * @returns The user service.
    */
    app.factory('userService', ['$http', function($http) {
        var scope = {
            account: null,
            character: null
        };

        /**
         * Selects the character, updating the current scope.
         * @param {string} characterId The character to select.
         */
        scope.selectCharacter = function(characterId) {
            var character = scope.account.characters[characterId];

            // validate the character exists on the account
            if (!character) {
                return;
            }

            // check if the character already has inventory
            if (character.inventory) {
                scope.character = character;
                return;
            }

            // otherwise load it
            $http.get(character.inventoryPath).then(function(result) {
                if (result.data === null) {
                    throw 'todo: No data.';
                } else {
                    character.inventory = result.data;
                    scope.character = character;
                }
            }, function(err) {
                throw err;
            });
        };

        return scope;
    }]);
})(angular.module('destinyTailorApp'));
