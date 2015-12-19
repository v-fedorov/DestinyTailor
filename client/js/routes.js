(function() {
    'use strict';

    angular.module('main').config(Routes);
    Routes.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

    /**
     * Registers all possible routes / states.
     * @param {Object} $locationProvider The Angular location provider.
     * @param {Object} $stateProvider The url state provider.
     * @param {Object} $urlRouterProvider The url router provider.
     */
    function Routes($locationProvider, $stateProvider, $urlRouterProvider) {
        // allow html5 url routing
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        // default to search
        $urlRouterProvider.otherwise('/');

        // define the available states
        $stateProvider
            .state('search', {
                url: '/',
                templateUrl: '/js/user/search.html'
            })
            .state('search.account', {
                url: '{platform:xbox|psn}/{displayName}',
                templateUrl: '/js/user/search-account.html',
                controller: 'accountController'
            });
    }
})();
