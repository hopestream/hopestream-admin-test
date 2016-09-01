var HopeStream = HopeStream || {};

HopeStream.Speaker = function() {
};

HopeStream.Speaker.fromJSON = function(json) {
    var result = new HopeStream.Speaker();
    result.id = json.id;
    result.name = json.name;
    result.description = json.description;
    result.imageUrl = json.imageUrl;
    result.thumbnailUrl = json.thumbnailUrl;

    return result;
};
