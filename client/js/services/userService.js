(function(app) {
    'use strict';
    
    /**
     * The user service, primarily used to share the current membership, and selected character.
     * @param {object} $http The http utils from Angular.
     * @returns The user service.
     */
    function userService($http) {
        var scope = {
            account: null,
            character: null,
            getAccountId: getAccountId,
            getCharacterId: getCharacterId,
            selectCharacter: selectCharacter
        };
        
        return scope;

        /**
         * Gets the current account id.
         * @returns The account id.
         */
        function getAccountId() {
            return scope.account ? scope.account.membershipId : null;
        };
        
        /**
         * Gets the currently selected character id.
         * @returns The character id.
         */
        function getCharacterId() {
            return scope.character ? scope.character.characterId : null;
        }
        
        function selectCharacter(characterId) {
            var character = scope.account.characters[characterId];
            
            // validate the character exists on the account
            if (!character) {
                return;
            }
            
            // check if the character already has inventory
            if (character.inventory) {
                scope.character = character;
                return;
            };
            
            // otherwise load it
            $http.get(character.inventoryPath).then(function(result) {
                if (result.data === null) {
                    throw 'todo: No data.'
                } else {
                    character.inventory = result.data;
                    scope.character = character;
                };
            }, function(err) {
                throw 'todo: Handle errors.';
            });
        };
    };
    
    // register the factory and dependencies
    angular.module('destinyTailorApp').factory('userService', userService);
    userService.$inject = ['$http'];
})();
