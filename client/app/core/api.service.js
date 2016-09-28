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

        var copyProperties = function(source, destination, properties) {
            for (var i = 0; i < properties.length; i++) {
                var property = properties[i];
                if (source[property] !== undefined) { destination[property] = source[property]; }
            }
        };

        this.session = Session;

        this.getMedia = function() {
            return this.session.GET('media').then(parseAPIResponse);
        };

        this.createMedia = function() {
            return this.session.POST('media').then(parseAPIResponse);
        }

        this.updateMedia = function(media) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }

            var data = {};
            copyProperties(media, data, ['name', 'description', 'hidden', 'speakerIds', 'topicIds']);
            data.date = media.date.getTime();
            data.seriesId = media.seriesId || null;

            return this.session.PUT('media/' + media.id, {}, {}, data);
        };

        this.updateMediaStatus = function(media, status) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }
            return this.session.PUT('media/' + media.id, {}, {}, { 'status': status });
        }

        this.uploadImageForMedia = function(media, image) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }
            return this.session.UPLOAD('media/' + media.id + '/image', {}, {}, { 'image': image });
        };

        this.getUploadPolicyForMedia = function(media, contentType) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }
            if (!contentType) { return Promise.reject('No content type provided.'); }
            return this.session.GET('media/' + media.id + '/upload-policy', { 'contentType': contentType }).then(function(result) { return result.data; });
        };

        this.getUsageForMedia = function(media) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }
            return this.session.GET('media/' + media.id + '/usage').then(function(result) { return result.data.usage; });
        };

        this.deleteMedia = function(media) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }
            return this.session.DELETE('media/' + media.id);
        };

        this.getSeries = function() {
            return this.session.GET('series').then(parseAPIResponse);
        };

        this.getSpeakers = function() {
            return this.session.GET('speakers/all').then(parseAPIResponse);
        };

        this.getOrganizations = function() {
            return this.session.GET('organizations').then(parseAPIResponse);
        };

        this.updateOrganization = function(organization) {
            if (!organization || !organization.id) { return Promise.reject('No organization provided.'); }

            var data = {};
            copyProperties(organization, data, 'name', 'description', 'url');

            return this.session.PUT('organizations/' + organization.id, {}, {}, data);
        };

        this.getUsageForOrganization = function(organization) {
            if (!organization || !organization.id) { return Promise.reject('No organization provided.'); }
            return this.session.GET('organizations/' + organization.id + '/usage').then(function(result) { return result.data.usage; });
        }

        this.getTopics = function() {
            return this.session.GET('topics').then(parseAPIResponse);
        };

        this.getUser = function() {
            return this.session.GET('users').then(parseAPIResponse);
        };

        this.getFeeds = function() {
            return this.session.GET('feeds').then(parseAPIResponse);
        };

        this.createFeed = function() {
            return this.session.POST('feeds').then(parseAPIResponse);
        }

        this.updateFeed = function(feed) {
            if (!feed || !feed.id) { return Promise.reject('No feed provided.'); }

            var data = {};
            copyProperties(feed, data, ['title', 'subtitle', 'description', 'type', 'copyright', 'url', 'email', 'category', 'keywords']);

            return this.session.PUT('feeds/' + feed.id, {}, {}, data);
        };

        this.deleteFeed = function(feed) {
            if (!feed || !feed.id) { return Promise.reject('No feed provided.'); }
            return this.session.DELETE('feeds/' + feed.id);
        };

        this.getMediaIDsForFeed = function(feed) {
            if (!feed || !feed.id) { return Promise.reject('No feed provided.'); }
            return this.session.GET('feeds/' + feed.id + '/media').then(function(result) { return result.data; });
        };

        this.addMediaIDForFeed = function(feed, id) {
            if (!feed || !feed.id) { return Promise.reject('No feed provided.'); }
            return this.session.PUT('feeds/' + feed.id + '/media', { 'id': id });
        };

        this.removeMediaIDForFeed = function(feed, id) {
            if (!feed || !feed.id) { return Promise.reject('No feed provided.'); }
            return this.session.DELETE('feeds/' + feed.id + '/media', { 'id': id });
        };
    }
})();
