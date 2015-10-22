(function(app) {
    /**
     * The user service, primarily used to share the current membership, and selected character.
     */
    app.factory('userService', ['$http', function($http) {
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
    }]);
})(angular.module('destinyTailorApp'));
