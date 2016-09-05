(function() {
    'use strict';

    angular
        .module('app.organization')
        .controller('Organization', Organization);

    Organization.$inject = ['$scope', 'API', 'State'];

    function Organization($scope, API, State) {
        var vm = this;
        vm.state = State;
        vm.organization = angular.copy(State.organization);
        vm.saving = false;
        vm.save = save;

        function save() {
            vm.saving = true;
            API.updateOrganization(vm.organization)
                .then(function() {
                    vm.saving = false;
                    State.organization = vm.organization;
                }, function() {
                    vm.saving = false;
                });
        }

        $scope.$watch(function() { return State.organization; }, function() {
            if (!vm.organization) { vm.organization = angular.copy(State.organization); }
        });
    }
})();
