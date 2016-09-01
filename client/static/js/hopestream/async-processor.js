var HopeStream = HopeStream || {};

HopeStream.AsyncProcessor = function() {
    this.enabled = true;
    this.working = false;
    this.maxRetryCount = 0;
    this.retryDelay = 5.0;

    this.process = function(key) { completion(null, true); }
    this.progress = undefined; // key, data, result
    this.complete = undefined; // result

    var processing = undefined;
    var pending = undefined;
    var retryCount = 0;
    var pointer = 0;
    var result = HopeStream.AsyncProcessor.SUCCESS;

    this.processKeys = function(keys) {
        if (keys === undefined || !this.enabled) { return; }

        pending = keys;
        if (processing !== undefined) { return; }

        this.working = true;
        processing = pending;
        pending = undefined;

        this.next();
    };

    this.next = function() {
        if (0 == processing.length || processing.length <= pointer) {
            var _result = result;
            result = HopeStream.AsyncProcessor.SUCCESS;
            pointer = 0;
            processing = undefined;
            this.working = false;

            if (self.complete) { self.complete(_result); }

            if (undefined === processing) {
                this.processKeys(pending);
            }

            return;
        }

        this.process(processing[pointer])
            .then($.proxy(function(result) {
                this.completion(result, true);
            }, this))
            .catch($.proxy(function(error) {
                this.completion(undefined, false);
            }, this));
    };

    this.completion = function(data, success) {
        if (result == HopeStream.AsyncProcessor.CANCELED) {
            this.next();
        } else if (success) {
            if (this.progress) {
                this.progress(processing[pointer], data, HopeStream.AsyncProcessor.SUCCESS);
            }

            retryCount = 0;
            pointer++;
            this.next();
        } else if (this.maxRetryCount == HopeStream.AsyncProcessor.RETRY_NO_LIMIT || retryCount < this.maxRetryCount) {
            if (this.progress) {
                this.progress(processing[pointer], undefined, HopeStream.AsyncProcessor.FAILED_WILL_RETRY);
            }

            retryCount++;
            setTimeout($.proxy(function() {
                this.next();
            }, this), this.retryDelay * 1000);
        } else {
            if (this.progress) {
                this.progress(processing[pointer], undefined, HopeStream.AsyncProcessor.FAILED);
            }

            result = HopeStream.AsyncProcessor.FAILED;
            retryCount = 0;
            pointer++;
            this.next();
        }
    };

    this.cancel = function() {
        if (!processing || processing.length == 0) { return; }

        processing = [];
        result = HopeStream.AsyncProcessor.CANCELED;
    };
}

HopeStream.AsyncProcessor.SUCCESS = 0;
HopeStream.AsyncProcessor.FAILED = 1;
HopeStream.AsyncProcessor.FAILED_WILL_RETRY = 2;
HopeStream.AsyncProcessor.CANCELED = 3;

HopeStream.AsyncProcessor.RETRY_NO_LIMIT = -1;
