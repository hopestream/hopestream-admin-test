(function() {
    'use strict';

    angular
        .module('app.core')
        .service('Session', Session);

    Session.$inject = ['$http', 'Upload'];

    function Session($http, Upload) {
        var API_URL = 'https://apitest.hopestream.com/';
        var OAUTH_CLIENT_BASE_64 = btoa('hopestream-admin:f085c37a-5d21-4eb4-8b73-355c11d2e60d');

        var getAccessToken = function() { return Lockr.get('Session.access-token'); }
        var setAccessToken = function(accessToken) { Lockr.set('Session.access-token', accessToken); }

        var request = function(service, method, path, params, headers, data) {
            params = params || {};
            headers = headers || {};

            if (service === $http) {
                headers['Accept'] = 'application/json';
                if (!headers['Content-Type']) { headers['Content-Type'] = 'application/json'; }
            }

            var accessToken = getAccessToken();
            if (accessToken && !headers['Authorization']) { headers['Authorization'] = 'Bearer ' + accessToken; }

            let url = API_URL;
            if (path.lastIndexOf('oauth/token', 0) != 0) { url = url + 'admin/api/1/'; }
            url = url + path;

            return service({
                'url': url,
                'method': method,
                'headers': headers,
                'params': params,
                'data': data
            });
        };

        this.userIsLoggedIn = function() {
            return getAccessToken() ? true : false;
        };

        this.userLogin = function(email, password) {
            var data = 'username=' + email + '&password=' + password + '&grant_type=password&scope=admin';
            var headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + OAUTH_CLIENT_BASE_64
            }

            return this.POST('oauth/token', {}, headers, data)
                .then(function (result) {
                    if (!result.data.access_token) { throw 'Invalid access token'; }

                    setAccessToken(result.data.access_token);
                });
        };

        this.userLogout = function() {
            setAccessToken(undefined);
            return Promise.resolve(true);
        };

        this.GET = function(path, params, headers, data) {
            return request($http, "GET", path, params, headers, data);
        };

        this.POST = function(path, params, headers, data) {
            return request($http, "POST", path, params, headers, data);
        };

        this.PUT = function(path, params, headers, data) {
            return request($http, "PUT", path, params, headers, data);
        };

        this.DELETE = function(path, params, headers, data) {
            return request($http, "DELETE", path, params, headers, data);
        };

        this.UPLOAD = function(path, params, headers, data) {
            return request(Upload.upload, "POST", path, params, headers, data);
        };
    }
})();
