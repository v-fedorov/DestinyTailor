(function(app) {
    'use strict';
    
    /**
     * Provides a directive for the Bootstrap toggle control.
     * @link https://gist.github.com/jjmontesl/54457bf1342edeb218b7
     * @returns The directive.
     */
    function bootstrapToggle() {
        return {
            restrict: 'A',
            transclude: true,
            replace: false,
            require: 'ngModel',
            link: function ($scope, $element, $attr, $ngModel) {
                // update the model on element change
                $element.on('change', function () {
                    if ($element[0].checked !== $ngModel.$viewValue) {
                        $ngModel.$setViewValue($element[0].checked);
                        $scope.$apply();
                    }
                });

                // observe the model changes
                $scope.$watch(function () {
                    return $ngModel.$viewValue;
                }, function () {
                    var isDisabled = $element[0].disabled;
                    $($element).bootstrapToggle('enable')
                        .trigger('change')
                        .bootstrapToggle(isDisabled ? 'disable': 'enable');
                });

                // observe the attribute set by ngDisabled
                $scope.$watch(function () {
                    return $element[0].disabled;
                }, function (isDisabled) {
                    $($element).bootstrapToggle(isDisabled ? 'disable': 'enable');
                });
            }
        };
    };
    
    // register the directive
    angular.module('destinyTailorApp')
        .directive('geBootstrapToggle', bootstrapToggle);
})();
