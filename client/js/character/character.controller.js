(function(app) {
    'use strict';

    angular.module('main').controller('characterController', CharacterController);
    CharacterController.$inject = ['$scope', 'userService'];

    /**
     * Defines the character controller, allowing the user to view their gear and stat profiles.
     * @param {Object} $scope The scope of the contorller.
     * @param {Object} userService The user service.
     */
    function CharacterController($scope, userService) {
        $scope.character = null;
        $scope.currentStatProfile = {};

        /**
         * Selects the desired stat profile.
         * @param {Object} statProfile The stat profile that was selected.
         */
        $scope.selectStatProfile = function(statProfile) {
            $scope.currentStatProfile = statProfile;
        };

        // watch for the character changing
        $scope.$watch(function() {
            return userService.character ? userService.character.characterId : null;
        }, function() {
            $scope.character = userService.character;
            $scope.currentStatProfile = {};
        });
    }
})();
