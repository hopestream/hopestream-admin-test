// UploadProgress 1.0.0
// (c) 2016 Corey Scherbing <coreyscherbing@gmail.com>
// https://bitbucket.org/coreyscherbing/upload-progress

(function(root, factory) {

    // UMD (Universal Module Definition) https://github.com/umdjs/umd

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module unless amdModuleId is set
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.UploadProgress = factory();
    }

}(this, function() {

    'use strict';

    var MEGABITS_PER_BYTE = 1 / 131072;
    var MILLISECONDS_PER_SECOND = 1000;

    /**
     * Top level namespace for UploadProgress,
     * a JavaScript library for managing progress of multiple file uploads.
     * @name UploadProgress
     */
    var UploadProgress = {};

    /**
     * Creates an Upload entity.
     * @class An Upload represents a single file upload.
     *
     * @constructor
     * @param {number} currentTime current time in milliseconds (Unix timestamp)
     * @param {number} currentUploadedBytes current number of uploaded bytes (cumulative total)
     * @param {number} totalBytes number of total bytes for the file upload
     */
    UploadProgress.Upload = function(currentTime, currentUploadedBytes, totalBytes) {

        // Average speed calculation uses an exponential moving average.
        // Enter a smoothing factor between 0 and 1. The higher the smoothing factor,
        // the faster old samples are discarded.
        // @see http://stackoverflow.com/questions/2779600/how-to-estimate-download-time-remaining-accurately
        var AVERAGE_SPEED_SMOOTHING_FACTOR = 0.005;

        /**
         * @exports upload as UploadProgress.Upload
         * @private
         */
        var upload = {},
            latestTime = currentTime,                   // milliseconds (Unix timestamp)
            latestBytesUploaded = currentUploadedBytes, // bytes
            bytesTotal = totalBytes,                    // bytes
            averageSpeed;                               // bytes per millisecond

        /**
         * Updates the progress of this upload.
         * @param {number} currentTime current time in milliseconds (Unix timestamp)
         * @param {number} currentUploadedBytes current number of uploaded bytes (cumulative total)
         */
        upload.update = function(currentTime, currentUploadedBytes) {
            var elapsedTime = currentTime - latestTime,
                uploadedBytes = currentUploadedBytes - latestBytesUploaded,
                currentSpeed = uploadedBytes / elapsedTime;

            if (!averageSpeed) {
                averageSpeed = currentSpeed;
            } else {
                averageSpeed = AVERAGE_SPEED_SMOOTHING_FACTOR * currentSpeed +
                    (1 - AVERAGE_SPEED_SMOOTHING_FACTOR) * averageSpeed;
            }

            latestTime = currentTime;
            latestBytesUploaded = currentUploadedBytes;
        };

        /**
         * Returns the average upload speed in bytes per millisecond.
         * @return {number} average upload speed in bytes per millisecond (decimal number)
         */
        upload.averageSpeed = function() {
            if (!averageSpeed) { return 0; }
            return averageSpeed;
        };

        /**
         * Returns the average upload speed in megabits per second.
         * @return {number} average upload speed in megabits per second (decimal number)
         */
        upload.averageSpeedMbps = function() {
            if (!averageSpeed) { return 0; }
            return averageSpeed * MEGABITS_PER_BYTE * MILLISECONDS_PER_SECOND;
        };

        /**
         * Returns the percentage of uploaded bytes.
         * @return {number} percentage of uploaded bytes (decimal e.g. 13.7541)
         */
        upload.percentUploaded = function() {
            return (latestBytesUploaded / bytesTotal) * 100;
        };

        /**
         * Returns the number of bytes remaining to upload.
         * @return {number} number of bytes remaining to upload
         */
        upload.bytesRemaining = function() {
            return bytesTotal - latestBytesUploaded;
        };

        /**
         * Returns the estimated time remaining in milliseconds.
         * @return {number} number of milliseconds remaining.
         */
        upload.timeRemaining = function() {
            if (!averageSpeed) { return 0; }
            return upload.bytesRemaining() / averageSpeed;
        };

        return upload;

    };

    /**
     * Creates a Manager entity.
     * @class A Manager manages the progress of multiple uploads
     *
     * @constructor
     */
    UploadProgress.Manager = function() {

        /**
         * @exports manager as UploadProgress.Manager
         * @private
         */
        var manager = {},
            uploads = []; // Array of current uploads

        /**
         * Adds an upload to the manager.
         * @param {string} uploadId unique ID for the upload
         * @param {UploadProgress.Upload} upload the upload
         */
        manager.addUpload = function(uploadId, upload) {
            uploads[uploadId] = upload;
        };

        /**
         * Removes an upload from the manager.
         * @param {string} uploadId unique ID for the upload
         */
        manager.removeUpload = function(uploadId) {
            delete uploads[uploadId];
        };

        /**
         * Returns the specified upload.
         * @param {string} uploadId unique ID for the upload
         * @return {UploadProgress.Upload} the upload
         */
        manager.getUpload = function(uploadId) {
            return uploads[uploadId];
        };

        /**
         * Returns the number of current uploads.
         * @return {number} the number of current uploads
         */
        manager.uploadsCount = function() {
            return Object.keys(uploads).length;
        };

        /**
         * Updates the progress for an upload.
         * @param {string} uploadId unique ID for the upload
         * @param {number} currentTime current time in milliseconds (Unix timestamp)
         * @param {number} currentUploadedBytes current number of uploaded bytes (cumulative total)
         */
        manager.updateUpload = function(uploadId, currentTime, currentUploadedBytes) {
            uploads[uploadId].update(currentTime, currentUploadedBytes);
        };

        /**
         * Returns the highest average upload speed for all current uploads in bytes per millisecond.
         * @return {number} highest average upload speed for all current uploads in bytes per millisecond (decimal number)
         */
        manager.averageSpeed = function() {
            if (manager.uploadsCount() === 0) { return 0; }

            var highestAverageSpeed = 0;

            Object.keys(uploads).forEach(function(key) {
                var upload = manager.getUpload(key),
                    averageSpeed = upload.averageSpeed();

                if (averageSpeed > highestAverageSpeed) {
                    highestAverageSpeed = averageSpeed;
                }
            });

            return highestAverageSpeed;
        };

        /**
         * Returns the highest average upload speed for all current uploads in megabits per second.
         * @return {number} highest average upload speed for all current uploads in megabits per second (decimal number)
         */
        manager.averageSpeedMbps = function() {
            if (manager.uploadsCount() === 0) { return 0; }

            var highestAverageSpeed = 0;

            Object.keys(uploads).forEach(function(key) {
                var upload = manager.getUpload(key),
                    averageSpeed = upload.averageSpeedMbps();

                if (averageSpeed > highestAverageSpeed) {
                    highestAverageSpeed = averageSpeed;
                }
            });

            return highestAverageSpeed;
        };

        /**
         * Returns the percentage of uploaded bytes for all current uploads.
         * @return {number} percentage of uploaded bytes for all current uploads (decimal e.g. 13.7541)
         */
        manager.percentUploaded = function() {
            if (manager.uploadsCount() === 0) { return 100; }

            var sumPercentUploaded = 0;

            Object.keys(uploads).forEach(function(key) {
                var upload = manager.getUpload(key);
                sumPercentUploaded += upload.percentUploaded();
            });

            return sumPercentUploaded / manager.uploadsCount();
        };

        /**
         * Returns the number of bytes remaining to upload for all current uploads.
         * @return {number} number of bytes remaining to upload for all current uploads
         */
        manager.bytesRemaining = function() {
            if (manager.uploadsCount() === 0) { return 0; }

            var sumBytesRemaining = 0;

            Object.keys(uploads).forEach(function(key) {
                var upload = manager.getUpload(key);
                sumBytesRemaining += upload.bytesRemaining();
            });

            return sumBytesRemaining;
        };

        /**
         * Returns the estimated time remaining in milliseconds for all current uploads.
         * @return {number} number of milliseconds remaining for all current uploads.
         */
        manager.timeRemaining = function() {
            if (manager.averageSpeed() === 0) { return 0; }
            return manager.bytesRemaining() / manager.averageSpeed();
        };

        return manager;
    };

    return UploadProgress;

}));
