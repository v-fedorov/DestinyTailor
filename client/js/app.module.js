(function() {
    'use strict';

    var app = angular.module('main', [
        'angular-loading-bar',
        'focus-if',
        'ngAnimate',
        'ngResource',
        'ngStorage',
        'ui.router'
    ]);

    // configure the loading bar
    app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]);
})();
