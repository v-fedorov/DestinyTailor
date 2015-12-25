(function() {
    'use strict';

    angular.module('main').controller('accountController', AccountController);
    AccountController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'PLATFORMS', 'userService'];

    /**
     * Defines the account controller, allowing the user to swap their selected character.
     * @param {Object} $rootScope The root scope.
     * @param {Object} $scope The scope of the contorller.
     * @param {Object} $state The state provider.
     * @param {Object} $stateParams The state parameters.
     * @param {Object} PLATFORMS The constant object containing the platform ids.
     * @param {Object} userService The user service.
     */
    function AccountController($rootScope, $scope, $state, $stateParams, PLATFORMS, userService) {
        $scope.account = null;
        $scope.selectedCharacter = null;

        /**
         * Changes the current character.
         * @param {Object} character The character to select.
         */
        $scope.selectCharacter = function(character) {
            $state.go('search.account.character', character);
        };

        // update the scope when the account has changed
        $scope.$on('account.change', function(ev, account) {
            $scope.account = account;
            $scope.selectedCharacter = null;
        });
        
        // update the scope when the character has changed
        $scope.$on('character.change', function(ev, character) {
            $scope.character = character;
        });

        // search for the account
        (function() {
            var membershipType = PLATFORMS[$stateParams.membershipTypeName];
            $rootScope.$broadcast('search.start');

            // load the account and its characters
            userService.getAccount(membershipType, $stateParams.displayName)
            .then(userService.loadCharacters)
            .then(userService.setAccount)
            .catch(function(err) {
                $rootScope.$broadcast('search.error', err);
            }).finally(function() {
                $rootScope.$broadcast('search.stop');
            });
        })();
    }
})();
