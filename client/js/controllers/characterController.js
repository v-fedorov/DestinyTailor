(function(app) {
    'use strict';

    /**
     * Defines the character controller, allowing the user to view their gear and stat profiles.
     * @param {Object} $scope The scope of the contorller.
     * @param {Object} userService The user service.
     * @param {Function} inventoryAnalyser The inventory analyser used to assess the stat paths.
     */
    var CharacterController = function($scope, userService, inventoryAnalyser) {
        $scope.character = null;
        $scope.selectedStats = {};
        $scope.statProfiles = [];

        /**
         * Selects the desired stat profile.
         * @param {Object} statProfile The stat profile that was selected.
         */
        $scope.selectStatProfile = function(statProfile) {
            $scope.selectedStats = statProfile.inventory;
        };

        // watch for the character changing
        $scope.$watch(function() {
            return userService.character ? userService.character.characterId : null;
        }, function() {
            $scope.character = userService.character;
            $scope.selectedStats = {};

            // update the scope
            if ($scope.character) {
                $scope.statProfiles = inventoryAnalyser.getStatProfiles($scope.character);
            } else {
                $scope.statProfiles = {};
            }
        });
    };

    CharacterController.$inject = ['$scope', 'userService', 'inventoryAnalyser'];
    app.controller('characterController', CharacterController);
})(angular.module('destinyTailorApp'));
