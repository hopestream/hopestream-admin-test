(function() {
    'use strict';

    angular
        .module('app.core')
        .service('Session', Session);

    Session.$inject = ['$http'];

    function Session($http) {
        var API_URL = 'http://localhost:3000/';
        var OAUTH_CLIENT_BASE_64 = btoa('hopestream-ios:jquo64ym8hvje2pxepto9');

        var getAccessToken = function() { return Lockr.get('Session.access-token'); }
        var setAccessToken = function(accessToken) { Lockr.set('Session.access-token', accessToken); }

        var request = function(method, path, params, headers, data) {
            params = params || {};
            headers = headers || {};

            headers['Accept'] = 'application/json';
            if (!headers['Content-Type']) { headers['Content-Type'] = 'application/json'; }

            var accessToken = getAccessToken();
            if (accessToken && !headers['Authorization']) { headers['Authorization'] = 'Bearer ' + accessToken; }

            let url = API_URL;
            if (path.lastIndexOf('oauth/token', 0) != 0) { url = url + 'admin/api/1/'; }
            url = url + path;

            return $http({
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
            return request("GET", path, params, headers, data);
        };

        this.POST = function(path, params, headers, data) {
            return request("POST", path, params, headers, data);
        };

        this.PUT = function(path, params, headers, data) {
            return request("PUT", path, params, headers, data);
        };

        this.DELETE = function(path, params, headers, data) {
            return request("DELETE", path, params, headers, data);
        };
    }
})();
