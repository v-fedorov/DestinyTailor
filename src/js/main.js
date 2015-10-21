(function() {
    var app = angular.module('destinyTailorApp', []);

    var PLATFORM_PSN = true;
    var PLATFORM_XBOX = false;

    /**
     * Defines a directive for setting the background image.
     * @link http://stackoverflow.com/a/13782311/259656)
     */
    app.directive('geBackgroundImg', function () {
        return function ($scope, $element, $attrs) {
            $attrs.$observe('geBackgroundImg', function (value) {
                $element.css({
                    'background-image': 'url(' + value + ')',
                    'background-size': 'cover'
                });
            });
        };
    });

    /**
     * Provides a directive for the Bootstrap toggle control.
     * @link https://gist.github.com/jjmontesl/54457bf1342edeb218b7
     */
    app.directive('geBootstrapToggle', function () {
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
    });
    
    /**
     * The user service, primarily used to share the current membership, and selected character.
     */
    app.factory('userService', function() {
        return { membership: {} };
    });

    /**
     * Defines the membership controller, allowing the user to swap their selected character.
     * @param {object} $scope The scope of the contorller.
     * @param {object} userService The user service.
     */
    app.controller('characterController', ['$scope', 'userService', function($scope, userService) {
        $scope.$watch(function() {
            return userService.membership;
        }, function(membership) {
            $scope.membership = membership;
        }, true);
    }]);

    /**
     * The search controller, primarily used to search for a user's account / membership with Bungie.
     * @param {object} $scope The scope of the controller.
     * @param {object} $http The http utils from Angular.
     * @param {object} userService The user service.
     */
    app.controller('searchController', ['$scope', '$http', 'userService', function ($scope, $http, userService) {
        $scope.platform = PLATFORM_PSN;

        /**
         * Searches for a character and updates the membership in the user service.
         */
        $scope.search = function() {
            var path = "/api/" + ($scope.platform === PLATFORM_PSN ? 2 : 1) + '/' + encodeURIComponent($scope.name) + '/';
            $scope.isLoading = true;

            // begin the request
            $http.get(path).then(function(result) {
                $scope.isLoading = false;
                if (result.data === null) {
                    $scope.error = 'Unable to find character.';
                } else {
                    userService.membership = result.data;
                };
            }, function(err) {
                $scope.isLoading = false;
                $scope.error = err.statusText;
            });
        };
    }]);
})();
