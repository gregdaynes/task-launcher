angular.module('authService', [])

// AUTH SERVICE ================
// =============================

// AUTH ------------------------
// auth factory login and get inforomation
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
.factory('Auth', function($http, $q, $log, AuthToken) {

    // create auth factory object
    var authFactory = {};

    // log a user in
    authFactory.login = function(username, password) {

        // return the promise object and its data
        return $http.post('/api/authenticate', {
            username: username,
            password: password
        })
            .success(function(data) {
                AuthToken.set(data.token);
                return data;
            });
    };

    // log user out by clearing the token
    authFactory.logout = function() {
        $log.debug('authFactory.logout()');

        return $q(function(resolve, reject) {


            if (AuthToken.set()) {
                resolve(true);
            } else {
                reject(false);
            }
        })

        // clear the token
//         AuthToken.set();
    };

    // check if a user is logged in
    // check if there is a local token
    authFactory.isLoggedIn = function() {
        if (AuthToken.get()) {
            return true;
        } else {
            return false;
        }
    };

    // get the logged in user
    authFactory.getUser = function() {
        return $q(function(resolve, reject) {

            if (AuthToken.get()) {
                resolve($http.get('/api/me', {cache:true}));
            } else {
                reject({
                    message: "User has no token."
                });
            }

        });
    };

    // return auth factory object
    return authFactory;

})


// AUTHTOKEN -------------------
// factory for handling tokens
// inject $window to store token client-side
.factory('AuthToken', function($window) {

    var authTokenFactory = {};

    // get the token out of local storage
    authTokenFactory.get = function() {
        return $window.localStorage.getItem('token');
    };

    // set the token or clear the token
    // if token is passed, set token
    // if no token, clear it from local storage
    authTokenFactory.set = function(token) {

        if (token) {
            $window.localStorage.setItem('token', token);
            return true;
        } else {
            $window.localStorage.removeItem('token');
            return true;
        }

        return;

    };

    // return auth token factory object
    return authTokenFactory;

})


// AUTHINTERCEPTOR -------------
// application configuration to integrate token into requests
.factory('AuthInterceptor', function($q, $location, AuthToken) {

    var interceptorFactory = {};

    // this will happen on all HTTP requests
    interceptorFactory.request = function(config) {

        // grab the token
        var token = AuthToken.get();

        // if token exists, add to head as x-access-token
        if (token) {
            config.headers['x-access-token'] = token;
        }

        return config;
    };

    // happens on response errors
    interceptorFactory.responseError = function(response) {

        // if our server returns a 403 forbidden response
        if (response.status == 403) {
            AuthToken.set();
            $location.path('/login');
        }

        // return the errors from the server as a promise
        return $q.reject(response);
    };

    // return interceptor factory object
    return interceptorFactory;

})