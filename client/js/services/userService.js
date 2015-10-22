(function(app) {
    /**
     * The user service, primarily used to share the current membership, and selected character.
     */
    app.factory('userService', function() {
        var account = null;

        return {
            getAccount: function() {
                return account;
            },
            setAccount: function(val) {
                account = val;
            },
            getAccountId: function() {
                return account ? account.membershipId : 0;
            }
        };
    });
})(angular.module('destinyTailorApp'));
