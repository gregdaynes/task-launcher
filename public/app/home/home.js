'use strict';

angular.module('app.home', [])

.config(function($stateProvider) {
    $stateProvider.state('app.home', {
        url: '/',
        views: {
            '@': {
                templateUrl: 'app/home/home.html'
            }
        }
    });
})