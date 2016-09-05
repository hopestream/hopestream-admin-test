var HopeStream = HopeStream || {};

HopeStream.APIResponse = function() {
    this.media = [];
    this.mediaByID = {};

    this.series = [];
    this.seriesByID = {};

    this.speakers = [];
    this.speakersByID = {};

    this.organizations = [];
    this.organizationsByID = {};

    this.topics = [];
    this.topicsByID = {};
    this.topicsByCategory = {};

    this.users = [];

    this.feeds = [];
    this.feedsByID = {};
};

HopeStream.APIResponse.fromJSON = function(json) {
    if (!json) { return undefined; }

    let result = new HopeStream.APIResponse();

    var topics = json.topics || [];
    for (var i = 0; i < topics.length; i++) {
        var topic = HopeStream.Topic.fromJSON(topics[i]);
        if (!topic) { continue; }

        result.topics.push(topic);
        result.topicsByID[topic.id] = topic;
        if (!result.topicsByCategory[topic.category]) { result.topicsByCategory[topic.category] = []; }
        result.topicsByCategory[topic.category].push(topic);
    }

    var organizations = json.organizations || [];
    for (var i = 0; i < organizations.length; i++) {
        var organization = HopeStream.Organization.fromJSON(organizations[i]);
        if (!organization) { continue; }

        result.organizations.push(organization);
        result.organizationsByID[organization.id] = organization;
    }

    var speakers = json.speakers || [];
    for (var i = 0; i < speakers.length; i++) {
        var speaker = HopeStream.Speaker.fromJSON(speakers[i]);
        if (!speaker) { continue; }

        result.speakers.push(speaker);
        result.speakersByID[speaker.id] = speaker;
    }

    var series = json.series || [];
    for (var i = 0; i < series.length; i++) {
        var entry = HopeStream.Series.fromJSON(series[i]);
        if (!entry) { continue; }

        result.series.push(entry);
        result.seriesByID[entry.id] = entry;
    }

    var media = json.media || [];
    for (var i = 0; i < media.length; i++) {
        var medium = HopeStream.Media.fromJSON(media[i]);
        if (!medium) { continue; }

        result.media.push(medium);
        result.mediaByID[medium.id] = medium;
    }

    var users = json.users || [];
    for (var i = 0; i < users.length; i++) {
        var user = HopeStream.User.fromJSON(users[i]);
        if (!user) { continue; }

        result.users.push(user);
    }

    var feeds = json.feeds || [];
    for (var i = 0; i < feeds.length; i++) {
        var feed = HopeStream.Feed.fromJSON(feeds[i]);
        if (!feed) { continue; }

        result.feeds.push(feed);
        result.feedsByID[feed.id] = feed;
    }

    return result;
};
