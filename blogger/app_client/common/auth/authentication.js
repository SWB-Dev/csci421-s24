var app = angular.module('bloggerApp');
// var common = angular.module('common');

app.service('authentication', authentication);
    authentication.$inject = ['$window', '$http'];
    function authentication ($window, $http) {
        var saveToken = function (token) {
            $window.localStorage['blog-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['blog-token'];
        };

        var getPayload = function (token) {
            return JSON.parse($window.atob(token.split('.')[1]));
        };

        var register = function (user) {
            console.log('Registering user ' + user.email);
            return $http.post('/api/register', user)
                .success((data) => {
                    saveToken(data.token);
                });
        };

        var login = function (user) {
            return $http.post('/api/login', user)
                .success((data) => {
                    saveToken(data.token);
                });
        };

        var logout = function () {
            $window.localStorage.removeItem('blog-token');
        };

        var isLoggedIn = function () {
            var token = getToken();
            if (token) {
                var payload = getPayload(token);
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function () {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = getPayload(token);
                return {
                    email: payload.email,
                    name: payload.name
                };
            }
        };

        return {
            saveToken: saveToken,
            getToken: getToken,
            getPayload: getPayload,
            register: register,
            login: login,
            logout: logout,
            isLoggedin: isLoggedIn,
            currentUser: currentUser
        };
    };

app.contoller('LoginController', [
    '$http', 
    '$location', 
    'authentication', 
    function LoginController ($http, $location, authentication) {
        var ctrl = this;
        ctrl.title = 'Sign into Blogger';

        ctrl.credentials = {
            email: "",
            password: ""
        };

        ctrl.formError = "";

        ctrl.returnPage = $location.search().page || '/';

        ctrl.onSubmit = function () {
            if (!ctrl.credentials.email || !ctrl.credentials.password) {
                ctrl.formError = "All fields are required.";
                return false;
            } else {
                ctrl.doLogin();
            }
        };

        ctrl.doLogin = function () {
            authentication
                .login(ctrl.credentials)
                .error((err) => ctrl.formError = err.message)
                .then(() => {
                    $location.search('page', null);
                    $location.path(ctrl.returnPage);
                });
        };

    }
]);

app.controller('RegisterController', [
    '$http',
    '$location',
    'authentication',
    function RegisterController ($http, $location, authentication) {
        var ctrl = this;
        ctrl.pageHeader = {
            title: 'Sign into Blogger'
        };

        ctrl.credentials = {
            email: "",
            password: ""
        };

        ctrl.formError = "";

        ctrl.returnPage = $location.search().page || '/';

        ctrl.onSubmit = function () {
            if (!ctrl.credentials.name 
                || !ctrl.credentials.email 
                || !ctrl.credentials.password) 
            {
                ctrl.formError = "All fields are required."
                return false;
            } else {
                ctrl.doRegister();
            }
        };

        ctrl.doRegister = function () {
            authentication
                .register(ctrl.credentials)
                .error((err) => ctrl.formError = "The provided email is already registered.")
                .then(() => {
                    $location.search('page', null);
                    $location.path(ctrl.returnPage);
                });
        };
    }
]);