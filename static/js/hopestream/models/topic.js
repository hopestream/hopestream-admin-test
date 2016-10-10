var HopeStream = HopeStream || {};

HopeStream.Topic = function() {
};

HopeStream.Topic.fromJSON = function(json) {
    var result = new HopeStream.Topic();
    result.id = json.id;
    result.name = json.name;
    result.category = json.category;

    return result;
};
