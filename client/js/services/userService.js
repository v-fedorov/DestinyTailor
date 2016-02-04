(function() {
    'use strict';

    angular.module('main').factory('userService', userService);
    userService.$inject = ['$rootScope', '$http', '$q', 'Character', 'inventoryService'];

    /**
     * The user service, primarily used to share the current membership, and selected character.
     * @param {Object} $rootScope The root scope.
     * @param {Object} $http The http utils from Angular.
     * @param {Object} $q Service helper for running function asynchronously.
     * @param {Object} Character The character model.
     * @param {Object} inventoryService The inventory service.
     * @returns {Object} The user service.
     */
    function userService($rootScope, $http, $q, Character, inventoryService) {
        var $scope = {
            // variables
            account: null,
            character: null,

            // functions
            getAccount: getAccount,
            setAccount: setAccount,
            loadCharacters: loadCharacters,
            selectCharacterByUrlSlug: selectCharacterByUrlSlug
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
                // anything greater than 1, is considered an error
                if (result.data.ErrorCode > 1) {
                    throw result.data.Message;
                }

                // when there aren't any character, sad times
                if (result.data.Response.length !== 0) {
                    throw 'Unable to find account.';
                }

                // success when we have at least 1 account; we should only ever have 1...
                return result.data.Response[0];
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
            }).then(assignCharacterSlugUrls);
        }

        /**
         * Assigns slug urls to characters on the account.
         * @param {Object} account The account.
         * @returns {Object} The account.
         */
        function assignCharacterSlugUrls(account) {
            var classCount = {};

            // set the initial slugs
            account.characters.forEach(function(character) {
                classCount[character.class] = (classCount[character.class] || 0) + 1;
                character.urlSlug = character.class.toLowerCase() + '-' + classCount[character.class];
            });

            // tidy up the urls if we can, this is designed for accounts with a character of each class
            account.characters.forEach(function(character) {
                if (classCount[character.class] === 1) {
                    character.urlSlug = character.class.toLowerCase();
                }
            });

            return account;
        }

        /**
         * Selects the character, updating the current $scope.
         * @param {Object} urlSlug The URL slug of the character.
         */
        function selectCharacterByUrlSlug(urlSlug) {
            // find the relevant character
            var character = getCharacterByUrlSlug(urlSlug);
            if (character === null) {
                console.error('Unable to find the selected character');
                return;
            }

            // update the character
            $scope.character = character;
            $rootScope.$broadcast('character.change', character);

            // load the inventory when its empty
            if (character && !character.inventory) {
                inventoryService.getInventory(character)
                .then(function(inventory) {
                    character.inventory = inventory;
                    character.statProfiles = inventoryService.getStatProfiles(character);
                });
            }
        };

        /**
         * Attempt to get the character for the given mini slug url.
         * @param {String} urlSlug The URL slug.
         * @returns {Object|null} The character, if found, otherwise null.
         */
        function getCharacterByUrlSlug(urlSlug) {
            // compare the slug urls
            for (var i = 0; i < $scope.account.characters.length; i++) {
                if ($scope.account.characters[i].urlSlug === urlSlug) {
                    return $scope.account.characters[i];
                }
            }

            return null;
        }
    }
})();
