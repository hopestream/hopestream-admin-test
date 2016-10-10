(function() {
    'use strict';

    angular
        .module('app.navbar')
        .controller('Navbar', Navbar);

    Navbar.$inject = ['State'];

    function Navbar(State) {
        var vm = this;
        vm.state = State;
        vm.logout = logout;

        function logout() {
            State.logout();
        };
    }
})();
