(function() {
    'use strict';

    angular.module('main').controller('accountController', AccountController);
    AccountController.$inject = ['$rootScope', '$scope', '$stateParams', 'PLATFORMS', 'userService'];

    /**
     * Defines the account controller, allowing the user to swap their selected character.
     * @param {Object} $rootScope The root scope.
     * @param {Object} $scope The scope of the contorller.
     * @param {Object} $stateParams The state parameters.
     * @param {Object} PLATFORMS The constant object containing the platform ids.
     * @param {Object} userService The user service.
     */
    function AccountController($rootScope, $scope, $stateParams, PLATFORMS, userService) {
        $scope.account = null;
        $scope.selectedCharacter = null;
        userService.selectCharacter(null);

        /**
         * Changes the current character.
         * @param {Object} character The character to select.
         */
        $scope.selectCharacter = function(character) {
            userService.selectCharacter(character);
            $scope.selectedCharacter = character;
        };

        // update the scope when the account has changed
        $scope.$on('account.change', function(ev, account) {
            $scope.account = account;
            $scope.selectedCharacter = null;
        });

        // search for the account
        (function() {
            var platformId = $stateParams.platform === 'psn' ? PLATFORMS.psn : PLATFORMS.xbox;
            $rootScope.$broadcast('search.start');

            // load the account and its characters
            userService.getAccount(platformId, $stateParams.displayName)
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
