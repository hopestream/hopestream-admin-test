(function() {
    'use strict';

    var TABS = {
        'home': 'organization', 'organization': 'organization',
        'media-list': 'media', 'media': 'media', 'upload': 'media',
        'series-list': 'series', 'series': 'series',
        'speaker-list': 'speakers', 'speaker': 'speakers',
        'feed-list': 'feeds', 'feed': 'feeds'
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
        State.topicsByCategory = undefined;
        State.feeds = undefined;
        State.feedsByID = undefined;

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
                    var responses = [];
                    return $q.all([
                        API.getMedia(),
                        API.getSeries(),
                        API.getSpeakers(),
                        API.getOrganizations(),
                        API.getTopics(),
                        API.getFeeds()
                    ])
                    .then(function(result) {
                        responses = result;

                        var requests = [];
                        var feeds = result[5].feeds;
                        for (var i = 0; i < feeds.length; i++) {
                            var feed = feeds[i];
                            requests.push(API.getMediaIDsForFeed(feed));
                        }

                        return $q.all(requests);
                    })
                    .then(function(result) {
                        var feeds = responses[5].feeds;
                        for (var i = 0; i < feeds.length; i++) {
                            feeds[i].mediaIds = result[i].ids;
                        }

                        return responses;
                    });
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
                    State.topicsByCategory = result[4].topicsByCategory;
                    State.feeds = result[5].feeds;
                    State.feedsByID = result[5].feedsByID;
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
                State.topicsByCategory = undefined;
                State.feeds = undefined;
                State.feedsByID = undefined;

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
