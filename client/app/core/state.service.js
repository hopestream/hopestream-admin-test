(function() {
    'use strict';

    angular
        .module('app.core')
        .service('State', State);

    State.$inject = ['$rootScope', '$state', 'API'];

    function State($rootScope, $state, API) {
        var State = this;

        State.user = Lockr.get('State.user');
        State.loggedIn = false;
        State.tab = undefined;

        State.login = function(email, password) {
            return API.session.userLogin(email, password)
                .then(function() { return API.getUser(); })
                .then(function(result) {
                    var user = result.users && result.users.length > 0 && result.users[0];
                    if (!user) { throw new Error('No user found.'); }

                    State.user = user;
                    return user;
                });
        };

        State.logout = function() {
            State.user = undefined;
            return API.session.userLogout();
        };

        function updateLoggedInState() {
            State.loggedIn = State.user && API.session.userIsLoggedIn;
            evaluateCurrentlyVisibleView();
        };

        var TABS = {
            'home': 'organization', 'organization': 'organization',
            'media': 'media', 'media-details': 'media', 'upload': 'media',
            'feeds': 'feeds', 'feed-details': 'feeds',
            'usage': 'usage'
        };
        function evaluateCurrentlyVisibleView() {
            console.log("Evaluating Current State");
            console.log($state.current.name);
            State.tab = TABS[$state.current.name];

            if (State.loggedIn && $state.current.name == 'login') {
                $state.go('home');
            } else if (!State.loggedIn && $state.current.name != 'login') {
                $state.go('login');
            }
        };

        $rootScope.$watch(function() { return State.user; }, function() {
            Lockr.set('State.user', State.user);
            updateLoggedInState();
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            evaluateCurrentlyVisibleView();
        });
    }
})();
