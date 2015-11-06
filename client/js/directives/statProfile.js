(function(app) {
    'use strict';

    /**
     * Defines a directive for showing a character's stat profile.
     */
    app.directive('geStatProfile', function() {
        return {
            restrict: 'AE',
            scope: {
                data: '=ngModel',
                select: '=select'
            },
            templateUrl: 'js/views/statProfile.html',
            /**
             * Registers the event for selecting the stat profile.
             * @param {Object} $scope The directive's scope.
             * @param {Object} $element The main element.
             */
            link: function($scope, $element) {
                $element.click(function() {
                    $scope.select($scope.data);
                });
            }
        };
    });
})(angular.module('destinyTailorApp'));
