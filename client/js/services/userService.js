(function() {
    'use strict';

    angular.module('main').factory('userService', userService);
    userService.$inject = ['$rootScope', '$http', '$q', 'Account', 'Character', 'inventoryService'];

    /**
     * The user service, primarily used to share the current membership, and selected character.
     * @param {Object} $rootScope The root scope.
     * @param {Object} $http The http utils from Angular.
     * @param {Object} $q Service helper for running function asynchronously.
     * @param {Object} Account The account model.
     * @param {Object} Character The character model.
     * @param {Object} inventoryService The inventory service.
     * @returns {Object} The user service.
     */
    function userService($rootScope, $http, $q, Account, Character, inventoryService) {
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
            return searchDestinyPlayer(membershipType, displayName)
                .then(handleRequestErrors)
                .then(validatePlayerFound)
                .then(getCharacters);            
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
         * Searches for a Destiny membership by their platform and display name.
         * @param {Number} membershipType The membership type; either 1 for xbox, or 2 for PSN.
         * @param {String} displayName The display name to search for.
         * @returns {Object} The result of the search as a promise.
         */
        function searchDestinyPlayer(membershipType, displayName) {
            var path = '/Platform/Destiny/SearchDestinyPlayer/' + membershipType + '/' + encodeURIComponent(displayName) + '/';
            return $http.get(path);
        }
        
        /**
         * Handles any request errors.
         * @param {Object} result The API result to check.
         * @returns {Object} The API result.
         */
        function handleRequestErrors(result) {
            // accept if the error code is okay
            if (result.data.ErrorCode === 1) {
                return result;
            }
            
            throw result.data.Message;
        }
        
        /**
         * Validates a player has been found.
         * @param {Object} searchResult The result of the player search.
         * @returns {Object} The API result.
         */
        function validatePlayerFound(searchResult) {
            if (searchResult.data.Response !== undefined && searchResult.data.Response.length > 0) {
                return searchResult;
            }

            throw 'Character not found';
        }
        
        function getCharacters(searchResult) {        
            var account;
            
            // request the memberships
            return getAccountSummaries(searchResult)
                .then(getActiveAccountSummaryData)
                .then(function(result) {
                    account = new Account(result.data.Response.data);
                    return result;
                })
                .then(parseCharacters)
                .then(assignCharacterSlugUrls)
                .then(function(characters) {
                    account.characters = characters;
                    return account;
                });
        }
        
        /**
         * Gets all account summaries for a given search result.
         * @param {Object} searchResult The search result from the Bungie API.
         * @returns The results from requesting the account summary for each search result.
         */
        function getAccountSummaries(searchResult) {
            // handle multiple results for xbox gamertags
            var accountSummaries = searchResult.data.Response.map(function(membership) {
                return getAccountSummary(membership.membershipType, membership.membershipId)
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
         * Gets the account summary for a membership.
         * @param {Number} membershipType The membership type; either 1 for xbox, or 2 for PSN.
         * @param {Number} membershipId The id of the membership.
         * @returns {Object} The result of requesting the account summary.
         */
        function getAccountSummary(membershipType, membershipId) {
            var path = '/Platform/Destiny/' + membershipType + '/Account/' + membershipId + '/';
            return $http.get(path);
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
         * @param {Object} accountSummaryResult The account summary API result.
         * @returns {Object} The characters from the account summary.
         */
        function parseCharacters(accountSummaryResult) {           
            // resolve the mapped characters
            return accountSummaryResult.data.Response.data.characters.map(function(data) {
                return new Character(accountSummaryResult.data.Response.data, data);
            }).sort(function(a, b) {
                return a.membershipId - b.membershipId;
            });
        }

        /**
         * Assigns slug urls to a collection of characters.
         * @param {Object} characters The characters to assign slug URLs to.
         * @returns {Object} The characters.
         */
        function assignCharacterSlugUrls(characters) {
            var classCount = {};

            // set the initial slugs
            characters.forEach(function(character) {
                classCount[character.class] = (classCount[character.class] || 0) + 1;
                character.urlSlug = character.class.toLowerCase() + '-' + classCount[character.class];
            });

            // tidy up the urls if we can, this is designed for accounts with a character of each class
            characters.forEach(function(character) {
                if (classCount[character.class] === 1) {
                    character.urlSlug = character.class.toLowerCase();
                }
            });

            return characters;
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
