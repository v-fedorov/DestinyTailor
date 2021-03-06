(function() {
    'use strict';

    angular.module('main').directive('geBootstrapToggle', bootstrapToggle);

    /**
     * Provides a directive for the Bootstrap toggle control.
     * @returns {Object} The directive.
     * {@link https://gist.github.com/jjmontesl/54457bf1342edeb218b7}.
     */
    function bootstrapToggle() {
        /**
         * Registers the directive and its events.
         * @param {Object} $scope The directive's scope.
         * @param {Object} $element The main element.
         * @param {Object} $attr The attributes of the directive.
         * @param {Object} $ngModel The model.
         */
        function link($scope, $element, $attr, $ngModel) {
            // update the model on element change
            $element.on('change', function() {
                if ($element[0].checked !== $ngModel.$viewValue) {
                    $ngModel.$setViewValue($element[0].checked);
                    $scope.$apply();
                }
            });

            // observe the model changes
            $scope.$watch(function() {
                return $ngModel.$viewValue;
            }, function() {
                var isDisabled = $element[0].disabled;
                $($element).bootstrapToggle('enable')
                    .trigger('change')
                    .bootstrapToggle(isDisabled ? 'disable' : 'enable');
            });

            // observe the attribute set by ngDisabled
            $scope.$watch(function() {
                return $element[0].disabled;
            }, function(isDisabled) {
                $($element).bootstrapToggle(isDisabled ? 'disable' : 'enable');
            });
        }

        return {
            restrict: 'A',
            transclude: true,
            replace: false,
            require: 'ngModel',
            link: link
        };
    };
})();
