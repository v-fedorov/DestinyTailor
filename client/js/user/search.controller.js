(function() {
    'use strict';

    angular.module('main').controller('searchController', SearchController);
    SearchController.$inject = ['$scope', '$http', 'PLATFORMS', 'userService'];

    /**
     * The search controller, primarily used to search for a user's account / membership with Bungie.
     * @param {Object} $scope The scope of the controller.
     * @param {Object} $http The http utils from Angular.
     * @param {Object} PLATFORMS The constant containing the platform API numbers.
     * @param {Object} userService The user service.
     */
    function SearchController($scope, $http, PLATFORMS, userService) {
        var PLATFORM_PSN = true;
        $scope.error = '';
        $scope.isSearching = false;
        $scope.platform = PLATFORM_PSN;

        /**
         * Searches for a character and updates the account in the user service.
         */
        $scope.search = function() {
            var platformId = $scope.platform === PLATFORM_PSN ? PLATFORMS.psn : PLATFORMS.xbox;
            $scope.error = '';
            $scope.isSearching = true;

            // load the membership and it's characters
            userService.getMembership(platformId, $scope.name)
                .then(userService.loadCharacters)
                .then(userService.setMembership)
                .catch(function(err) {
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
    }
})();
