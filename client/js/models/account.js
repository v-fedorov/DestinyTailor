(function() {
    'use strict';

    angular.module('main').factory('Account', Model);

    /**
     * Defines the Account model.
     * @returns {Function} The account constructor.
     */
    function Model() {
        /**
         * Provides information about a account.
         * @constructor
         * @param {Object} data The data containing the account information.
         */
        function Account(data) {
            this.membershipType = data.membershipType;
            this.membershipId = data.membershipId;
            this.displayName = data.displayName;
        }

        return Account;
    }
})();
