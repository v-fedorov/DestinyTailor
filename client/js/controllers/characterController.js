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
        $scope.statProfiles = [];

        /**
         * Selects the desired stat profile.
         * @param {Object} statProfile The stat profile that was selected.
         */
        $scope.selectStatProfile = function(statProfile) {
            console.log(statProfile);
        };

        // watch for the character changing
        $scope.$watch(function() {
            return userService.character ? userService.character.characterId : null;
        }, function() {
            // update the scope
            $scope.character = userService.character;
            $scope.statProfiles = $scope.character ? inventoryAnalyser.getStatProfiles($scope.character) : [];
        });
    };

    CharacterController.$inject = ['$scope', 'userService', 'inventoryAnalyser'];
    app.controller('characterController', CharacterController);
})(angular.module('destinyTailorApp'));
