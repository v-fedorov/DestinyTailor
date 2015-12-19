(function() {
    'use strict';

    var app = angular.module('main', ['ngAnimate', 'angular-loading-bar']);

    // configure the loading bar
    app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]);
})();
