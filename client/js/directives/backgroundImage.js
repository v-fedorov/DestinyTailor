(function(app) {
    'use strict';
    
    /**
     * Defines a directive for setting the background image.
     * @link http://stackoverflow.com/a/13782311/259656)
     * @returns The directive.
     */
    function backgroundImg() {
        return function ($scope, $element, $attrs) {
            $attrs.$observe('geBackgroundImg', function (value) {
                $element.css({
                    'background-image': 'url(' + value + ')',
                    'background-size': 'cover'
                });
            });
        };
    };
    
    // register the directive
    angular.module('destinyTailorApp')
        .directive('geBackgroundImg', backgroundImg);
})();
