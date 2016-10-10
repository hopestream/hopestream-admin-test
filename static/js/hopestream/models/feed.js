var HopeStream = HopeStream || {};

HopeStream.Feed = function() {
};

HopeStream.Feed.fromJSON = function(json) {
    var result = new HopeStream.Feed();
    result.id = json.id;
    result.title = json.title;
    result.subtitle = json.subtitle;
    result.description = json.description;
    result.type = json.type;
    result.copyright = json.copyright;
    result.url = json.url;
    result.email = json.email;
    result.category = json.category;
    result.keywords = json.keywords;

    result.organizationId = json.organizationId;

    return result;
};
