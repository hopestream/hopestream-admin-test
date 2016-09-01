(function() {
    'use strict';

    angular
        .module('app.organization')
        .controller('OrganizationDetails', OrganizationDetails);

    OrganizationDetails.$inject = ['API', 'State'];

    function OrganizationDetails(API, State) {
        var vm = this;
        vm.state = State;
        vm.saving = false;
    }
})();
