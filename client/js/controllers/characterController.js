(function(app) {
    'use strict';

    /**
     * Defines the character controller, allowing the user to view their gear and stat profiles.
     * @param {object} $scope The scope of the contorller.
     * @param {object} userService The user service.
     * @param {function} inventoryAnalyser The inventory analyser used to assess the stat paths.
     */
    app.controller('characterController', ['$scope', 'userService', 'inventoryAnalyser', function($scope, userService, inventoryAnalyser) {
        $scope.character = null;

        $scope.$watch(function() {
            return userService.getCharacterId();
        }, onCharacterChange, true);

        function onCharacterChange() {
            $scope.character = userService.character;

            if ($scope.character !== null) {
                var profiles = inventoryAnalyser.getStatProfiles($scope.character);
                console.log(profiles);
            }
        }
    }]);
})(angular.module('destinyTailorApp'));
