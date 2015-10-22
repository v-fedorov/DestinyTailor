(function() {
    'use strict';
    
    /**
     * Defines the character controller, allowing the user to view their gear and stat profiles.
     * @param {object} $scope The scope of the contorller.
     * @param {object} userService The user service.
     */
    function characterController($scope, userService) {
        $scope.character = null;

        $scope.$watch(function() {
            return userService.getCharacterId();
        }, function() {
            $scope.character = userService.character;
        }, true);
    };
    
    // register the controller and dependencies
    angular.module('destinyTailorApp').controller('characterController', characterController);
    characterController.$inject = ['$scope', 'userService'];
})();
