(function() {
    'use strict';

    angular
        .module('app.core')
        .config(routerConfig);

    routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routerConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    'navbar': {
                        templateUrl: 'app/navbar/navbar.html',
                        controller: 'Navbar',
                        controllerAs: 'vm'
                    },
                    'content': {
                        templateUrl: 'app/login/login.html',
                        controller: 'Login',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('home', {
                url: '/',
                views: {
                    'navbar': {
                        templateUrl: 'app/navbar/navbar.html',
                        controller: 'Navbar',
                        controllerAs: 'vm'
                    },
                    'content': {
                        templateUrl: 'app/organization/organization.html',
                        controller: 'OrganizationDetails',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();
