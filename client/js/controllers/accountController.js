(function() {
    'use strict';
    
    /**
     * Defines the account controller, allowing the user to swap their selected character.
     * @param {object} $scope The scope of the contorller.
     * @param {object} userService The user service.
     */
    function accountController($scope, userService) {
        $scope.character = null;

        $scope.$watch(function() {
            return userService.getAccountId();
        }, function() {
            $scope.account = userService.account;
            $scope.character = null;
        }, true);

        /**
         * Changes the current character.
         * @param {object} character The character to select.
         */
        $scope.selectCharacter = function(character) {
            userService.selectCharacter(character.characterId);
        };
    };
    
    // register the controller and dependencies
    angular.module('destinyTailorApp').controller('accountController', accountController);
    accountController.$inject = ['$scope', 'userService'];
})();
