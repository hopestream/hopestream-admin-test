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
                        controller: 'Organization',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('organization', {
                url: '/organization',
                views: {
                    'navbar': {
                        templateUrl: 'app/navbar/navbar.html',
                        controller: 'Navbar',
                        controllerAs: 'vm'
                    },
                    'content': {
                        templateUrl: 'app/organization/organization.html',
                        controller: 'Organization',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('media-list', {
                url: '/media',
                views: {
                    'navbar': {
                        templateUrl: 'app/navbar/navbar.html',
                        controller: 'Navbar',
                        controllerAs: 'vm'
                    },
                    'content': {
                        templateUrl: 'app/media/media-list.html',
                        controller: 'MediaList',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('media', {
                url: '/media/:id',
                views: {
                    'navbar': {
                        templateUrl: 'app/navbar/navbar.html',
                        controller: 'Navbar',
                        controllerAs: 'vm'
                    },
                    'content': {
                        templateUrl: 'app/media/media.html',
                        controller: 'Media',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('upload', {
                url: '/upload',
                views: {
                    'navbar': {
                        templateUrl: 'app/navbar/navbar.html',
                        controller: 'Navbar',
                        controllerAs: 'vm'
                    },
                    'content': {
                        templateUrl: 'app/upload/upload.html',
                        controller: 'Upload',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('feed-list', {
                url: '/feeds',
                views: {
                    'navbar': {
                        templateUrl: 'app/navbar/navbar.html',
                        controller: 'Navbar',
                        controllerAs: 'vm'
                    },
                    'content': {
                        templateUrl: 'app/feeds/feed-list.html',
                        controller: 'FeedList',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();
