(function(app) {
    'use strict';
    
    /**
     * The user service, primarily used to share the current membership, and selected character.
     * @param {object} $http The http utils from Angular.
     * @returns The user service.
     */
    function userService($http) {
        return {
            getAccount: getAccount,
            getAccountId: getAccountId,
            setAccount: setAccount
        };

        var account = null;

        /**
         * Gets the current loaded account.
         * @returns The account.
         */
        function getAccount() {
            return account;
        };

        /**
         * Sets the current account.
         * @param {object} val The account.
         */
        function setAccount(val) {
            account = val;
        };

        /**
         * Gets the current account id; otherwise 0.
         * @returns The account id.
         */
        function getAccountId() {
            return account ? account.membershipId : 0;
        };
    };
    
    // register the factory and dependencies
    angular.module('destinyTailorApp').factory('userService', userService);
    userService.$inject = ['$http'];
})();
