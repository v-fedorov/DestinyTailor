(function() {
    'use strict';

    angular.module('main').factory('userService', userService);
    userService.$inject = ['$localStorage', '$rootScope', '$q', 'PLATFORMS', 'Account', 'Character', 'bungieService', 'inventoryService'];

    /**
     * The user service, primarily used to share the current membership, and selected character.
     * @param {Object} $localStorage The local storage provider.
     * @param {Object} $rootScope The root scope.
     * @param {Object} $q Service helper for running function asynchronously.
     * @param {Object} PLATFORMS The constant containing the platform information.
     * @param {Object} Account The account model.
     * @param {Object} Character The character model.
     * @param {Object} bungieService The Bungie service.
     * @param {Object} inventoryService The inventory service.
     * @returns {Object} The user service.
     */
    function userService($localStorage, $rootScope, $q, PLATFORMS, Account, Character, bungieService, inventoryService) {
        $localStorage.memberships = $localStorage.memberships || {
            1: {},
            2: {}
        };

        var $scope = {
            // variables
            account: null,
            character: null,

            // functions
            getAccount: getAccount,
            setAccount: setAccount,
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
            return searchLocalStorage(membershipType, displayName)
                .then(getAccountFromCache, getAccountFromBungie)
                .then(parseCharacters)
                .then(assignCharacterSlugUrls)
                .then(function(account) {
                    delete account.summary;
                    return account;
                });
        }

        /**
         * Searches the local storage for the membership, prior to checking Bungie.
         * @param {Number} membershipType The membership type.
         * @param {String} displayName The display name to search for.
         * @returns {Object} Either the local membership, or the search criteria.
         */
        function searchLocalStorage(membershipType, displayName) {
            var searchDisplayName = displayName.toLowerCase();

            // check the local storage for the membership
            if ($localStorage.memberships[membershipType] && $localStorage.memberships[membershipType][searchDisplayName]) {
                var clone = new Account($localStorage.memberships[membershipType][searchDisplayName]);
                return $q.resolve(clone);
            }

            // reject with the search criteria
            return $q.reject({
                membershipType: membershipType,
                displayName: displayName
            });
        }
        
        /**
         * Gets the characters, for the given account.
         * @param {Object} account The cached account.
         * @returns {Object} The account summary.
         */
        function getAccountFromCache(account) {
            return bungieService.getAccountSummary(account.membershipType, account.membershipId)
                .then(bungieService.throwErrors)
                .then(function(result) {
                    account.summary = result;
                    return account;
                });
        }

        /**
         * Gets the characters, for the given membership type and display name, from Bungie.
         * @param {Object} searchCriteria The search criteria, including the membership type and display name.
         * @returns {Object} The account summary.
         */
        function getAccountFromBungie(searchCriteria) {
            return bungieService.searchDestinyPlayer(searchCriteria.membershipType, searchCriteria.displayName)
                .then(bungieService.throwErrors)
                .then(validatePlayerFound)
                .then(getAccountSummaries)
                .then(getActiveAccountSummaryData)
                .then(cacheAccount);
        }

        /**
         * Caches the account from the account summary, returning the account.
         * @param {Object} accountSummaryResult The result of an account summary request.
         * @returns {Object} The account.
         */
        function cacheAccount(accountSummaryResult) {
            var account = new Account(accountSummaryResult.data.Response.data);
            $localStorage.memberships[account.membershipType][account.displayName.toLowerCase()] = account.toJsonObject();

            account.summary = accountSummaryResult;
            return account;
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
         * Validates a player has been found.
         * @param {Object} searchResult The result of the player search.
         * @returns {Object} The API result.
         */
        function validatePlayerFound(searchResult) {
            if (searchResult.data.Response.length > 0) {
                return searchResult;
            }

            throw 'Character not found';
        }

        /**
         * Gets all account summaries for a given search result.
         * @param {Object} searchResult The search result from the Bungie API.
         * @returns {Object} The results from requesting the account summary for each search result.
         */
        function getAccountSummaries(searchResult) {
            // handle multiple results for xbox gamertags
            var accountSummaries = searchResult.data.Response.map(function(membership) {
                return bungieService.getAccountSummary(membership.membershipType, membership.membershipId)
                    .then(function(result) {
                        if (result.data.Response) {
                            result.data.Response.data.displayName = membership.displayName;
                        }

                        return result;
                    });
            });

            return $q.all(accountSummaries);
        }

        /**
         * Gets the first active account summary, based on the results of many.
         * @param {Object[]} summaryResults The results of multiple account summary requests.
         * @returns {Object} The active account summary.
         */
        function getActiveAccountSummaryData(summaryResults) {
            // attempt to return the first result that was a success
            for (var i = 0; i < summaryResults.length; i++) {
                if (summaryResults[i].data.ErrorCode === 1) {
                    return summaryResults[i];
                }
            }

            // otherwise something went wrong!
            throw 'Character not found';
        }

        /**
         * Parses the characters for the given account summary.
         * @param {Object} account The account infomation, including the raw result of the summary.
         * @returns {Object} The account, with the parsed characters.
         */
        function parseCharacters(account) {
            // resolve the mapped characters
            account.characters = account.summary.data.Response.data.characters.map(function(data) {
                return new Character(account.summary.data.Response.data, data);
            }).sort(function(a, b) {
                return a.membershipId - b.membershipId;
            });

            return account;
        }

        /**
         * Assigns slug urls to a collection of characters.
         * @param {Object} account The account containing the characters to assign slug URLs to.
         * @returns {Object} The characters.
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
