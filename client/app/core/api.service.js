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

        this.createMedia = function(params) {
            return this.session.POST('media', params).then(parseAPIResponse);
        }

        this.updateMedia = function(media) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }

            var data = {};
            copyProperties(media, data, ['name', 'description', 'hidden', 'speakerIds', 'topicIds']);
            data.date = media.date.getTime();
            data.seriesId = media.seriesId || null;

            return this.session.PUT('media/' + media.id, {}, {}, data);
        };

        this.updateMediaURLs = function(media) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }

            var data = {};
            copyProperties(media, data, ['streamUrl', 'videoUrl', 'audioUrl']);

            return this.session.PUT('media/' + media.id, {}, {}, data);
        }

        this.updateMediaStatus = function(media, status) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }
            return this.session.PUT('media/' + media.id, {}, {}, { 'status': status });
        }

        this.uploadImageForMedia = function(media, image) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }
            return this.session.UPLOAD('media/' + media.id + '/image', {}, {}, { 'image': image }).then(parseAPIResponse);
        };

        this.setMediaImageToSeries = function(media, series) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }
            if (!series || !series.id) { return Promise.reject('No series provided.'); }
            return this.session.PUT('media/' + media.id + '/image', { 'seriesId': series.id }).then(parseAPIResponse);
        }

        this.setMediaImageToOrganization = function(media, organization) {
            if (!media || !media.id) { return Promise.reject('No media provided.'); }
            if (!organization || !organization.id) { return Promise.reject('No organization provided.'); }
            return this.session.PUT('media/' + media.id + '/image', { 'organizationId': organization.id }).then(parseAPIResponse);
        }

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

        this.createSeries = function() {
            return this.session.POST('series').then(parseAPIResponse);
        }

        this.updateSeries = function(series) {
            if (!series || !series.id) { return Promise.reject('No series provided.'); }

            var data = {};
            copyProperties(series, data, ['name', 'description']);

            return this.session.PUT('series/' + series.id, {}, {}, data);
        };

        this.uploadImageForSeries = function(series, image) {
            if (!series || !series.id) { return Promise.reject('No series provided.'); }
            return this.session.UPLOAD('series/' + series.id + '/image', {}, {}, { 'image': image }).then(parseAPIResponse);
        };

        this.deleteSeries = function(series) {
            if (!series || !series.id) { return Promise.reject('No series provided.'); }
            return this.session.DELETE('series/' + series.id);
        };

        this.getSpeakers = function() {
            return this.session.GET('speakers/all').then(parseAPIResponse);
        };

        this.createSpeaker = function(params) {
            return this.session.POST('speakers', params).then(parseAPIResponse);
        }

        this.updateSpeaker = function(speaker) {
            if (!speaker || !speaker.id) { return Promise.reject('No speaker provided.'); }

            var data = {};
            copyProperties(speaker, data, ['name', 'description']);

            return this.session.PUT('speakers/' + speaker.id, {}, {}, data);
        };

        this.uploadImageForSpeaker = function(speaker, image) {
            if (!speaker || !speaker.id) { return Promise.reject('No speaker provided.'); }
            return this.session.UPLOAD('speakers/' + speaker.id + '/image', {}, {}, { 'image': image }).then(parseAPIResponse);
        };

        this.deleteSpeaker = function(speaker) {
            if (!speaker || !speaker.id) { return Promise.reject('No speaker provided.'); }
            return this.session.DELETE('speakers/' + speaker.id);
        };

        this.claimSpeaker = function(speaker) {
            if (!speaker || !speaker.id) { return Promise.reject('No speaker provided.'); }
            return this.session.POST('speakers/' + speaker.id + '/claim');
        }

        this.getOrganizations = function() {
            return this.session.GET('organizations').then(parseAPIResponse);
        };

        this.updateOrganization = function(organization) {
            if (!organization || !organization.id) { return Promise.reject('No organization provided.'); }

            var data = {};
            copyProperties(organization, data, 'name', 'description', 'url');

            return this.session.PUT('organizations/' + organization.id, {}, {}, data);
        };

        this.uploadImageForOrganization = function(organization, image) {
            if (!organization || !organization.id) { return Promise.reject('No organization provided.'); }
            return this.session.UPLOAD('organizations/' + organization.id + '/image', {}, {}, { 'image': image }).then(parseAPIResponse);
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

        this.uploadImageForFeed = function(feed, image) {
            if (!feed || !feed.id) { return Promise.reject('No feed provided.'); }
            return this.session.UPLOAD('feeds/' + feed.id + '/image', {}, {}, { 'image': image });
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
