(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('Login', Login);

    Login.$inject = ['API', 'State'];

    function Login(API, State) {
        var vm = this;
        vm.email = undefined;
        vm.password = undefined;
        vm.error = null;
        vm.loading = false;
        vm.login = login;

        function login() {
            vm.loading = true;
            State.login(vm.email, vm.password)
                .then(function() {
                    vm.loading = false;
                })
                .catch(function(error) {
                    vm.loading = false
                });
        }
    }
})();
