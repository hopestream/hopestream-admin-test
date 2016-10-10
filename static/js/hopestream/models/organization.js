var HopeStream = HopeStream || {};

HopeStream.Organization = function() {
};

HopeStream.Organization.fromJSON = function(json) {
    var result = new HopeStream.Organization();
    result.id = json.id;
    result.name = json.name;
    result.description = json.description;
    result.imageUrl = json.imageUrl;
    result.thumbnailUrl = json.thumbnailUrl;
    result.url = json.url;

    return result;
};
