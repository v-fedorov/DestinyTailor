(function(app) {
    /**
     * The user service, primarily used to share the current membership, and selected character.
     */
    app.factory('userService', function() {
        return { membership: {} };
    });
})(angular.module('destinyTailorApp'));
