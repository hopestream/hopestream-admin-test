(function() {
    'use strict';

    var HASH_SALT = 'ca8b97bb-de3d-4d22-8716-195354fa1e4c';
    var HASH_LENGTH = 11;
    var hashids = new Hashids(HASH_SALT, HASH_LENGTH);

    angular
        .module('app.core')
        .service('Hash', Hash);

    Hash.$inject = [];

    function Hash() {
        this.encode = function(id) {
            return hashids.encode(id);
        };

        this.decode = function(hash) {
            return parseInt(hashids.decode(hash));
        };
    };
})();
