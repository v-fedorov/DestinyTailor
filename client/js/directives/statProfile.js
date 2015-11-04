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
            link: function($scope, $element) {
                $element.click(function() {
                    $scope.select($scope.data);
                });
            }
        };
    });
})(angular.module('destinyTailorApp'));
