(function(app) {
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
})(angular.module('destinyTailorApp'));
