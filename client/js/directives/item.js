(function(app) {
    'use strict';

    /**
     * Defines a directive for showing a character's item.
     */
    app.directive('geItem', function() {
        return {
            restrict: 'AE',
            scope: {
                data: '=ngModel'
            },
            templateUrl: 'js/views/item.html'
        };
    });
})(angular.module('destinyTailorApp'));
