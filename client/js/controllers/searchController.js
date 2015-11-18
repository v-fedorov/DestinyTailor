(function(app) {
    'use strict';

    /**
     * The search controller, primarily used to search for a user's account / membership with Bungie.
     * @param {Object} $scope The scope of the controller.
     * @param {Object} $http The http utils from Angular.
     * @param {Object} PLATFORMS The constant containing the platform API numbers.
     * @param {Object} userService The user service.
     */
    var SearchController = function($scope, $http, PLATFORMS, userService) {
        var PLATFORM_PSN = true;
        $scope = {
            error: '',
            isSearching: false,
            platform: PLATFORM_PSN
        };

        /**
         * Searches for a character and updates the account in the user service.
         */
        $scope.search = function() {
            var platformId = $scope.platform === PLATFORM_PSN ? PLATFORMS.psn : PLATFORMS.xbox;
            $scope.error = '';
            $scope.isSearching = true;

            userService.getMembership(platformId, $scope.name).then(function(result) {
                // load the characters
                return userService.getCharacters(result.membershipType, result.membershipId);
            }).then(function(characters) {
                // update the user service scope
                userService.character = null;
                userService.account = {
                    characters: characters,
                    membershipId: characters[0].membershipId
                };
            }).catch(function(err) {
                $scope.error = err;
            }).finally(function() {
                $scope.isSearching = false;
            });
        };

        /**
         * Clears any error messages.
         */
        $scope.clearError = function() {
            $scope.error = '';
        };
    };

    SearchController.$inject = ['$scope', '$http', 'PLATFORMS', 'userService'];
    app.controller('searchController', SearchController);
})(angular.module('main'));
