var HopeStream = HopeStream || {};

HopeStream.Media = function() {
};

HopeStream.Media.fromJSON = function(json) {
    var result = new HopeStream.Media();
    result.id = json.id;
    result.name = json.name;
    result.description = json.description;
    result.date = new Date(json.date || 0);
    result.status = json.status;
    result.hidden = json.hidden;
    result.type = json.type;
    result.audioUrl = json.audioUrl;
    result.videoUrl = json.videoUrl;
    result.streamUrl = json.streamUrl;
    result.imageUrl = json.imageUrl;
    result.thumbnailUrl = json.thumbnailUrl;
    result.date = new Date(json.date);
    result.title = json.title;
    result.subtitle = json.subtitle;

    result.organizationId = json.organizationId;
    result.seriesId = json.seriesId;
    result.speakerIds = json.speakerIds || [];
    result.topicIds = json.topicIds || [];

    return result;
};
