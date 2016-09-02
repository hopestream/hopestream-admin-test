(function() {
    'use strict';

    angular
        .module('app.core')
        .service('API', API);

    API.$inject = ['Session'];

    function API(Session) {
        var parseAPIResponse = function(result) {
            return HopeStream.APIResponse.fromJSON(result.data);
        };

        this.session = Session;

        this.getMedia = function() {
            return this.session.GET('media').then(parseAPIResponse);
        };

        this.getSeries = function() {
            return this.session.GET('series').then(parseAPIResponse);
        };

        this.getSpeakers = function() {
            return this.session.GET('speakers').then(parseAPIResponse);
        };

        this.getOrganizations = function() {
            return this.session.GET('organizations').then(parseAPIResponse);
        };

        this.updateOrganization = function(organization) {
            if (!organization) { return Promise.reject('No organization provided.'); }

            var data = {};
            data.name = organization.name || null;
            data.description = organization.description || null;
            data.url = organization.url || null;

            return this.session.PUT('organizations/' + organization.id, {}, {}, data);
        };

        this.getTopics = function() {
            return this.session.GET('topics').then(parseAPIResponse);
        };

        this.getUser = function() {
            return this.session.GET('users').then(parseAPIResponse);
        };

        this.getFeeds = function() {
            return this.session.GET('feeds').then(parseAPIResponse);
        }

        this.getMediaIDsForFeed = function(feed) {
            if (!feed || !feed.id) { return Promise.reject('No feed provided.'); }

            return this.session.GET('feeds/' + feed.id + '/media').then(function(result) { return result.data; });
        }
    }
})();
