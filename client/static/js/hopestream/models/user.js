var HopeStream = HopeStream || {};

HopeStream.User = function() {
};

HopeStream.User.fromJSON = function(json) {
    var result = new HopeStream.User();
    result.id = json.id;
    result.name = json.name;
    result.email = json.email;

    return result;
};
