(function() {
    'use strict';

    angular.module('main').config(Routes);
    Routes.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider', 'TEMPLATE_URLS'];

    /**
     * Registers all possible routes / states.
     * @param {Object} $locationProvider The Angular location provider.
     * @param {Object} $stateProvider The url state provider.
     * @param {Object} $urlRouterProvider The url router provider.
     * @param {Object} TEMPLATE_URLS The template Urls constant.
     */
    function Routes($locationProvider, $stateProvider, $urlRouterProvider, TEMPLATE_URLS) {
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
                templateUrl: TEMPLATE_URLS.routes.search.index
            })
            .state('search.account', {
                url: '{platform:xbox|psn}/{displayName}',
                templateUrl: TEMPLATE_URLS.routes.search.account,
                controller: 'accountController'
            });
    }
})();
