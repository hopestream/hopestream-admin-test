var HopeStream = HopeStream || {};

HopeStream.AsyncDataSource = function(search) {
    this.callback = function(data) {};

    var processor = new HopeStream.AsyncProcessor();
    processor.maxRetryCount = HopeStream.AsyncProcessor.RETRY_NO_LIMIT;
    processor.process = function(key) { return search(); };
    processor.progress = $.proxy(function(key, data, result) {
        if (result == HopeStream.AsyncProcessor.SUCCESS) {
            if (this.callback) { this.callback(data); }
        }
    }, this);

    this.refresh = function() {
        processor.processKeys([""]);
    };

    this.cancel = function() {
        processor.cancel();
    };
};
