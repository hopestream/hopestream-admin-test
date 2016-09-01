var HopeStream = HopeStream || {};

HopeStream.Series = function() {
};

HopeStream.Series.fromJSON = function(json) {
    var result = new HopeStream.Series();
    result.id = json.id;
    result.name = json.name;
    result.description = json.description;
    result.imageUrl = json.imageUrl;
    result.thumbnailUrl = json.thumbnailUrl;

    result.organizationId = json.organizationId;

    return result;
};
