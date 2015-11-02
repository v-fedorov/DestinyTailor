(function(app) {
    'use strict';

    /**
     * Defines a directive for showing a character's item.
     */
    app.directive('geCharacterItem', function() {
        return {
            restrict: 'AE',
            scope: {
                item: '=ngModel'
            },
            templateUrl: 'js/views/characterItem.html'
        };
    });
})(angular.module('destinyTailorApp'));
