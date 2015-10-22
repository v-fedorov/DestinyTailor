(function(app) {
    /**
     * Defines the account controller, allowing the user to swap their selected character.
     * @param {object} $scope The scope of the contorller.
     * @param {object} userService The user service.
     */
    app.controller('accountController', ['$scope', 'userService', function($scope, userService) {
        $scope.character = null;

        $scope.$watch(function() {
            console.log(userService.getAccountId());
            return userService.getAccountId();
        }, function() {
            $scope.account = userService.getAccount();
            $scope.character = null;
        }, true);

        $scope.selectCharacter = function(character) {
            console.log('Selected: ', character);
        };
    }]);
})(angular.module('destinyTailorApp'));
