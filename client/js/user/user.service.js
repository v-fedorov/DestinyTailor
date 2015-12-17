(function() {
    'use strict';

    angular.module('main').factory('userService', UserService);
    UserService.$inject = ['$rootScope', '$http', '$q', 'Character', 'inventoryService'];

    /**
     * The user service, primarily used to share the current membership, and selected character.
     * @param {Object} $rootScope The root scope.
     * @param {Object} $http The http utils from Angular.
     * @param {Object} $q Service helper for running function asynchronously.
     * @param {Object} Character The character model.
     * @param {Object} inventoryService The inventory service.
     * @returns {Object} The user service.
     */
    function UserService($rootScope, $http, $q, Character, inventoryService) {
        var $scope = {
            // variables
            account: null,
            character: null,

            // functions
            getAccount: getAccount,
            setAccount: setAccount,
            loadCharacters: loadCharacters,
            selectCharacter: selectCharacter
        };

        return $scope;

        /**
         * Gets the account information for the given type and display name.
         * @param {Number} membershipType The type that represents the platform, e.g. 1 for Xbox, or 2 for PSN.
         * @param {String} displayName The account's display name.
         * @returns {Object} The account, represented as a promise.
         */
        function getAccount(membershipType, displayName) {
            var path = '/Platform/Destiny/SearchDestinyPlayer/' + membershipType + '/' + encodeURIComponent(displayName) + '/';
            return $http.get(path).then(function(result) {
                // success when we have at least 1 account; we should only ever have 1...
                if (result.data.Response !== undefined && result.data.Response.length === 1) {
                    return result.data.Response[0];
                }

                throw 'Character not found';
            });
        }

        /**
         * Updates the current loaded account.
         * @param {Object} account The account.
         */
        function setAccount(account) {
            $scope.character = null;
            $scope.account = account;

            $rootScope.$broadcast('account.change', account);
        };

        /**
         * Loads the characters for the given account.
         * @param {Object} account The account.
         * @returns {Object} The account with the characters, represented as a promise.
         */
        function loadCharacters(account) {
            var path = '/Platform/Destiny/' + account.membershipType + '/Account/' + account.membershipId + '/';
            return $http.get(path).then(function(result) {
                // reject as there was an error from Bungie
                if (result.data.ErrorCode > 1) {
                    throw result.data.Message;
                }

                // resolve the mapped characters
                account.characters = result.data.Response.data.characters.map(function(data) {
                    return new Character(account, data);
                }).sort(function(a, b) {
                    return a.membershipId - b.membershipId;
                });

                return account;
            });
        }

        /**
         * Selects the character, updating the current $scope.
         * @param {Object} character The character to select.
         */
        function selectCharacter(character) {
            $scope.character = character;
            $rootScope.$broadcast('character.change', character);

            // load the inventory when its empty
            if (!character.inventory) {
                loadInventory(character)
                .then(function(inventory) {
                    character.inventory = inventory;
                    character.statProfiles = inventoryService.getStatProfiles(character);
                });
            }
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
    }
})();
