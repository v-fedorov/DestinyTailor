(function(app) {
    'use strict';

    angular.module('main').controller('characterController', CharacterController);
    CharacterController.$inject = ['$scope', 'userService', 'inventoryAnalyser'];

    /**
     * Defines the character controller, allowing the user to view their gear and stat profiles.
     * @param {Object} $scope The scope of the contorller.
     * @param {Object} userService The user service.
     * @param {Function} inventoryAnalyser The inventory analyser used to assess the stat paths.
     */
    function CharacterController($scope, userService, inventoryAnalyser) {
        $scope.character = null;
        $scope.currentStatProfile = {};
        $scope.statProfiles = [];

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

            // update the scope
            if ($scope.character) {
                $scope.statProfiles = inventoryAnalyser.getStatProfiles($scope.character);
            } else {
                $scope.statProfiles = {};
            }
        });
    }
})();
