(function(app) {
    var PLATFORM_PSN = true;
    var PLATFORM_XBOX = false;

    /**
     * The search controller, primarily used to search for a user's account / membership with Bungie.
     * @param {object} $scope The scope of the controller.
     * @param {object} $http The http utils from Angular.
     * @param {object} userService The user service.
     */
    app.controller('searchController', ['$scope', '$http', 'userService', function ($scope, $http, userService) {
        $scope.platform = PLATFORM_PSN;

        /**
         * Searches for a character and updates the account in the user service.
         */
        $scope.search = function() {
            var path = "/api/" + ($scope.platform === PLATFORM_PSN ? 2 : 1) + '/' + encodeURIComponent($scope.name) + '/';
            $scope.isLoading = true;

            // begin the request
            $http.get(path).then(function(result) {
                $scope.isLoading = false;
                if (result.data === null) {
                    $scope.error = 'Unable to find character.';
                } else {
                    userService.setAccount(result.data);
                };
            }, function(err) {
                $scope.isLoading = false;
                $scope.error = err.statusText;
            });
        };
    }]);
})(angular.module('destinyTailorApp'));
