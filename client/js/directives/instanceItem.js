(function(app) {
    /**
     * Defines a directive for showing a character's item.
     */
    app.directive('geInstanceItem', function () {
        return {
            restrict: 'AE',
            scope: {
                item: '=ngModel'
            },
            templateUrl: 'js/templates/instanceItem.tmp.html'
        };
    });
})(angular.module('destinyTailorApp'));
