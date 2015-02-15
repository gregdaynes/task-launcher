'use strict';

angular.module('app.user', ['userService'])

.config(function($stateProvider) { $stateProvider
    .state('app.users', {
        url: '/users',
        views: {
            'header@': {},
            '@': {
                templateUrl: 'app/user/all.html',
                controller: 'userCtrl as user'
            },
        }
    })

    .state('app.users.user', {
        url: '/:_id?id',
        views: {
            '@': {
                templateUrl: 'app/user/user.html',
                controller: 'userEditCtrl as user'
            },
        }
    })

    .state('app.users.create', {
        url: '/create',
        data: {
            type: 'create'
        },
        views: {
            '@': {
                templateUrl: 'app/user/user.html',
                controller: 'userCreateCtrl as user'
            },
        }
    })
})

.controller('userCtrl', function($log, User) {

    var vm = this;

    // set a processing variable to show loading things
    vm.processing = true;

    // grab all the users at page load
    User.all()
        .success(function(data) {

            $log.debug(data);

            // when all users back remove the processing variable
            vm.processing = false;

            // bind users to vm.users
            vm.users = data;
        });

    // delete user
    vm.deleteUser = function(id) {
        vm.processing = true;

        // accept the user id as parameter
        User.delete(id)
            .success(function(data) {

                // get all users to updat ethe table
                User.all()
                    .success(function(data) {
                        vm.processing = false;
                        vm.users = data;
                    });
            });
    };

})

.controller('userCreateCtrl', function($state, User) {

    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between create/edit pages
    vm.type = 'create'

    // function to create a user
    vm.saveUser = function() {
        vm.processing = true;

        // clear the message
        vm.message = '';

        // use the create function in the userService
        User.create(vm.userdata)
            .success(function(data) {

                vm.processing = false;

                // clear the form
                vm.userData = {};
                vm.message = data.message;
            });
    };

})

.controller('userEditCtrl', function($state, $stateParams, User) {

    var vm = this;

    // variable to hide/show elements of the view
    // differentiates between or edit pages
    vm.type = 'edit';

    // get user data for user to edit
    // routeParams is the way to grab data form the URL
    User.get($stateParams._id)
        .success(function(data) {
            vm.userData = data;
        });

    // function to save the user
    vm.saveUser = function() {
        vm.processing = true;
        vm.message = '';

        // call the userService function to update
        User.update($stateParams._id, vm.userData)
            .success(function(data) {
                vm.processing = false;

                // clear the form
                vm.userData = {};

                // bind the message from our api to vm.message
                vm.message = data.message;
            });
    };

})