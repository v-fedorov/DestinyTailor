(function(app) {
    'use strict';
    
    /**
     * Defines a directive for showing a character's item.
     * @retuns The directive.
     */
    function instanceItem() {
        return {
            restrict: 'AE',
            scope: {
                item: '=ngModel'
            },
            templateUrl: 'js/templates/instanceItem.tmp.html'
        };
    };
    
    // register the directive
    angular.module('destinyTailorApp')
        .directive('geBootstrapToggle', instanceItem);
})();
