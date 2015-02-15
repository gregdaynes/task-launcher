'use strict';

angular.module('app', [
    'ngRoute',
    'ui.router',


    'authService',
    'userService',

    'app.core',
    'app.home',
    'app.login',
    'app.user'
])

// setup state provider
.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
})

// setup route provider - default route
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
})

// application configuration to integrate token into requests
.config(function($httpProvider) {

    // atach our auth interceptor to the $http requests
    $httpProvider.interceptors.push('AuthInterceptor');
})