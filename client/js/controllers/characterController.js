(function(app) {
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
        }, true);
    }]);
})(angular.module('destinyTailorApp'));
