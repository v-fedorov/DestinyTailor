(function() {
    'use strict';
    
    /**
     * Defines the character controller, allowing the user to view their gear and stat profiles.
     * @param {object} $scope The scope of the contorller.
     * @param {object} userService The user service.
     * @param {function} InventoryAnalyser The inventory analyser class used to assess the stat paths.
     */
    function characterController($scope, userService, InventoryAnalyser) {
        $scope.character = null;

        $scope.$watch(function() {
            return userService.getCharacterId();
        }, onCharacterChange, true);
        
        function onCharacterChange() {
            $scope.character = userService.character;
            
            if ($scope.character !== null) {
                var inventory = $scope.character.inventory;
                console.log(inventory);
                
                var profiles = new InventoryAnalyser($scope.character);
                console.log(profiles.profiles);
            }
        }
    };

    // register the controller and dependencies
    angular.module('destinyTailorApp').controller('characterController', characterController);
    characterController.$inject = ['$scope', 'userService', 'InventoryAnalyser'];
})();
