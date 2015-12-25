(function() {
    'use strict';

    angular.module('main').controller('characterController', CharacterController);
    CharacterController.$inject = ['$scope', '$stateParams', 'userService'];

    /**
     * Defines the character controller, allowing the user to view their gear and stat profiles.
     * @param {Object} $scope The scope of the contorller.
     * @param {Object} $stateParams The state parameters.
     * @param {Object} userService The user service.
     */
    function CharacterController($scope, $stateParams, userService) {
        $scope.character = null;
        $scope.currentStatProfile = {};

        /**
         * Selects the desired stat profile.
         * @param {Object} statProfile The stat profile that was selected.
         */
        $scope.selectStatProfile = function(statProfile) {
            $scope.currentStatProfile = statProfile;
        };
        
        // update the scope when the character has changed
        $scope.$on('character.change', function(ev, character) {
            $scope.character = character;
            $scope.currentStatProfile = {};
        });
        
        // initialises the character controller        
        (function() {
            if (!userService.account || userService.account.displayName.toLowerCase() !== $stateParams.displayName.toLowerCase()) {
                // update the scope when the account has changed
                $scope.$on('account.change', function(ev, account) {
                    userService.selectCharacterByUrlSlug($stateParams.urlSlug);
                });    
            } else {
                userService.selectCharacterByUrlSlug($stateParams.urlSlug);
            }
        })();
    }
})();
