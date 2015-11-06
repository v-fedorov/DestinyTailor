(function(app) {
    'use strict';

    /**
     * The search controller, primarily used to search for a user's account / membership with Bungie.
     * @param {Object} $scope The scope of the controller.
     * @param {Object} $http The http utils from Angular.
     * @param {Object} $routeParams The route parameters.
     * @param {Object} PLATFORM The constant containing the platform API numbers.
     * @param {Object} userService The user service.
     */
    var SearchController = function($scope, $http, $routeParams, PLATFORM, userService) {
        var PLATFORM_PSN = true;
        $scope.name = $routeParams.name || '';
        $scope.platform = $routeParams.platform && $routeParams.platform === 'xbox' ? !PLATFORM_PSN : PLATFORM_PSN;

        /**
         * Searches for a character and updates the account in the user service.
         */
        $scope.search = function() {
            var platformId = $scope.platform === PLATFORM_PSN ? PLATFORM.psn : PLATFORM.xbox;
            var path = '/api/' + platformId + '/' + encodeURIComponent($scope.name) + '/';

            $scope.isLoading = true;

            // begin the request
            $http.get(path).then(function(result) {
                $scope.isLoading = false;
                if (result.data === null) {
                    $scope.error = 'Unable to find character.';
                } else {
                    console.log(userService);
                    userService.account = result.data;
                }
            }, function(err) {
                $scope.isLoading = false;
                $scope.error = err.statusText;
            });
        };

        // consider moving this outside of here
        if ($scope.name) {
            $scope.search();
        }
    };

    SearchController.$inject = ['$scope', '$http', '$routeParams', 'PLATFORM', 'userService'];
    app.controller('searchController', SearchController);
})(angular.module('destinyTailorApp'));
