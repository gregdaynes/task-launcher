'use strict';

angular.module('app.login', [])

.config(function($stateProvider) {
    $stateProvider.state('app.login', {
        url: '/login',
        views: {
            'header@': {
                templateUrl: 'app/login/login.html',
            },
        }
    });
})