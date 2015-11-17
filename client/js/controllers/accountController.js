(function(app) {
    'use strict';

    /**
     * Defines the account controller, allowing the user to swap their selected character.
     * @param {Object} $scope The scope of the contorller.
     * @param {Object} userService The user service.
     */
    var AccountController = function($scope, userService) {
        $scope.account = null;
        $scope.selectedCharacter = null;

        $scope.$watch(function() {
            return userService.account ? userService.account.membershipId : null;
        }, function() {
            $scope.account = userService.account;
            $scope.selectedCharacter = null;
        });

        /**
         * Changes the current character.
         * @param {Object} character The character to select.
         */
        $scope.selectCharacter = function(character) {
            userService.selectCharacter(character);
            $scope.selectedCharacter = character;
        };
    };

    AccountController.$inject = ['$scope', 'userService'];
    app.controller('accountController', AccountController);
})(angular.module('main'));
