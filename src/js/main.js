(function() {
    var app = angular.module('destinyTailorApp', []);

    /**
     * The user service, primarily used to share the current membership, and selected character.
     */
    app.factory('userService', function() {
        return { membership: {} };
    });

    /**
     * The search controller, primarily used to search for a user's account / membership with Bungie.
     * @param {object} $scope The scope of the controller.
     * @param {object} $http The http utils from Angular.
     * @param {object} userService The user service.
     */
    app.controller('searchController', ['$scope', '$http', 'userService', function ($scope, $http, userService) {
        var $platform = $('#platform');
        
        /**
         * Searches for a character and updates the membership in the user service.
         */
        $scope.search = function() {
            var path = "/api/" + ($platform[0].checked ? 2 : 1) + '/' + encodeURIComponent($scope.name) + '/';
            $scope.isLoading = true;
            
            // begin the request
            $http.get(path).then(function(result) {
                $scope.isLoading = false;
                if (result.data === null) {
                    $scope.error = 'Unable to find character.';
                } else {
                    userService.membership = result.data;
                };
            }, function(err) {
                $scope.error = err.statusText;
            });
        };
    }]);
    
    /**
     * Defines the membership controller, allowing the user to swap their selected character.
     * @param {object} $scope The scope of the contorller.
     * @param {object} userService The user service.
     */
    app.controller('characterController', ['$scope', 'userService', function($scope, userService) {
        $scope.$watch(function() {
            return userService.membership;
        }, function(membership) {
            $scope.membership = membership;
        }, true)
    }]);
})(); 
