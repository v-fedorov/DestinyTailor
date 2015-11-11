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
            var path = '/api/' + platformId + '/' + encodeURIComponent($scope.name) + '/';

            $scope.isSearching = true;

            // begin the request
            $http.get(path).then(function(result) {
                if (result.data === null) {
                    $scope.error = 'Unable to find character.';
                } else {
                    userService.account = result.data;
                    userService.character = null;
                }
            }, function(err) {
                $scope.error = err.statusText;
            }).then(function() {
                console.log('fuck yeah');
                $scope.isSearching = false;
            });
        };
    };

    SearchController.$inject = ['$scope', '$http', 'PLATFORMS', 'userService'];
    app.controller('searchController', SearchController);
})(angular.module('main'));
