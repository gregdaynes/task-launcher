'use strict';

angular.module('app.core', [])

.config(function($stateProvider) {
    abstract: true,
    $stateProvider.state('app', {
        url: '',
        views: {
            'nav': {
                templateUrl: '/app/core/nav.html'
            },
            'header': {
                templateUrl: 'app/core/header.html'
            },
            // '': {},
            'footer': {
                templateUrl: 'app/core/footer.html'
            }
        }
    });
})

.controller('coreCtrl', function($rootScope, $scope, $location, $log, Auth) {

    var vm = this;

    // get info if a person is logged in
    vm.loggedIn = Auth.isLoggedIn();

    // check to see if a user is logged in on every request
    $rootScope.$on('$locationChangeSuccess', function() {
        vm.loggedIn = Auth.isLoggedIn();

        // get user information on route change
        Auth.getUser()
            .then(function(data) {
                vm.user = data.data;
            });
    });

    // function to handle login form
    vm.doLogin = function() {

        vm.processing = true;

        // call the Auth.login() function
        Auth.login(vm.loginData.username, vm.loginData.password)
            .success(function(data) {

                vm.processing = false;

                if (data.success) {
                    // if a user succssfully logs in, redirect to users page
                    vm.loggedIn = true;
                    vm.user = data.data;
                    $location.path('/users');
                } else {
                    vm.error = data.message;
                }
            });

    };

    // function to handle logging out
    vm.doLogout = function() {
        Auth.logout()
            .then(function() {
                $location.path('/');
                vm.loggedIn = false;
            });

    };
})