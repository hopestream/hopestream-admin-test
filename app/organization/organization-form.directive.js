(function() {
    'use strict';

    angular
        .module('app.organization')
        .directive('hsOrganizationForm', organizationFormDirective);

    function organizationFormDirective() {
        return {
            restrict: 'E',
            scope: {},
            templateUrl: 'app/organization/organization-form.directive.html',
            controller: OrganizationFormController,
            controllerAs: 'vm'
        };
    }

    OrganizationFormController.$inject = ['$scope', '$timeout', 'API', 'State'];

    function OrganizationFormController($scope, $timeout, API, State) {
        var vm = this;
        vm.state = State;
        vm.saving = false;
        vm.dirty = false;
        vm.organization = angular.copy(State.organization);

        vm.save = function() {
            if (vm.saving) { return; }
            vm.saving = true;
            vm.dirty = false;

            API.updateOrganization(vm.organization).then(function() {
                angular.copy(vm.organization, State.organization);
                completeSave(false);
            }, function() {
                completeSave(true);
            });
        };

        function completeSave(error) {
            if (error) { vm.dirty = true; }

            $timeout(function() {
                vm.saving = false;
                if (vm.dirty) { vm.save(); }
            }, error ? 2000 : 500);
        }

        var initializing = true;
        $scope.$watch('vm.organization.name', formDidUpdate);
        $scope.$watch('vm.organization.url', formDidUpdate);
        $scope.$watch('vm.organization.description', formDidUpdate);
        function formDidUpdate() {
            if (initializing) { $timeout(function() { initializing = false; }, 0); return; }
            vm.dirty = true;
        }
    }
})();
