(function(app) {
    'use strict';

    /**
     * Defines a directive for showing a character's stat tier progress.
     */
    app.directive('geStatProgress', function() {
        return {
            restrict: 'AE',
            scope: {
                data: '=ngModel'
            },
            templateUrl: '/js/views/statProgress.html'
        };
    });
})(angular.module('destinyTailorApp'));
