(function() {
    'use strict';

    var TABS = {
        'home': 'organization', 'organization': 'organization',
        'media-list': 'media', 'media': 'media', 'upload': 'media',
        'feeds': 'feeds', 'feed-details': 'feeds',
        'usage': 'usage'
    };

    angular
        .module('app.core')
        .service('State', State);

    State.$inject = ['$rootScope', '$state', '$q', 'API'];

    function State($rootScope, $state, $q, API) {
        var State = this;

        State.user = Lockr.get('State.user');
        State.loggedIn = false;
        State.tab = undefined;

        State.media = undefined;
        State.mediaByID = undefined;
        State.series = undefined;
        State.seriesByID = undefined;
        State.speakers = undefined;
        State.speakersByID = undefined;
        State.organization = undefined;
        State.topics = undefined;
        State.topicsByID = undefined;

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
            updateDataSource();
            updateVisibleView();
        };

        function updateVisibleView() {
            console.log("Evaluating Current State");
            console.log($state.current.name);
            State.tab = TABS[$state.current.name];

            if (State.loggedIn && $state.current.name == 'login') {
                $state.go('home');
            } else if (!State.loggedIn && $state.current.name != 'login') {
                $state.go('login');
            }
        };

        var dataSource = undefined;
        function updateDataSource() {
            if (State.loggedIn && !dataSource) {
                dataSource = new HopeStream.AsyncDataSource(function() {
                    return $q.all([
                        API.getMedia(),
                        API.getSeries(),
                        API.getSpeakers(),
                        API.getOrganizations(),
                        API.getTopics(),
                    ]);
                });
                dataSource.callback = function(result) {
                    var organizations = result[3].organizations;
                    var topics = result[4].topics;

                    State.media = result[0].media;
                    State.mediaByID = result[0].mediaByID;
                    State.series = result[1].series;
                    State.seriesByID = result[1].seriesByID;
                    State.speakers = result[2].speakers;
                    State.speakersByID = result[2].speakersByID;
                    State.organization = organizations.length > 0 && organizations[0];
                    State.topics = result[4].topics;
                    State.topicsByID = result[4].topicsByID;
                };
                dataSource.refresh();
            } else if (!State.loggedIn && dataSource) {
                State.media = undefined;
                State.mediaByID = undefined;
                State.series = undefined;
                State.seriesByID = undefined;
                State.speakers = undefined;
                State.speakersByID = undefined;
                State.organization = undefined;
                State.topics = undefined;
                State.topicsByID = undefined;

                dataSource.callback = function() {}
                dataSource = undefined;
            }
        };

        $rootScope.$watch(function() { return State.user; }, function() {
            Lockr.set('State.user', State.user);
            updateLoggedInState();
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            updateVisibleView();
        });
    }
})();
