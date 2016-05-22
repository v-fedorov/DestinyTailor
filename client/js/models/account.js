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

        /**
         * Gets the serializable account.
         * @returns {Object} The account object that is safe for serialization.
         */
        Account.prototype.toJsonObject = function() {
            return {
                membershipType: this.membershipType,
                membershipId: this.membershipId,
                displayName: this.displayName
            };
        };

        return Account;
    }
})();
