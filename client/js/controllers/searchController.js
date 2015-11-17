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

        $scope.isSearching = false;
        $scope.platform = PLATFORM_PSN;

        /**
         * Searches for a character and updates the account in the user service.
         */
        $scope.search = function() {
            var platformId = $scope.platform === PLATFORM_PSN ? PLATFORMS.psn : PLATFORMS.xbox;
            $scope.isSearching = true;

            userService.getCharacters(platformId, $scope.name).then(function(result) {
                userService.character = null;
                userService.account = {
                    characters: result
                };
            }, function(err) {
                console.log(err);
            }).then(function() {
                $scope.isSearching = false;
            });
        };
    };

    SearchController.$inject = ['$scope', '$http', 'PLATFORMS', 'userService'];
    app.controller('searchController', SearchController);
})(angular.module('main'));
