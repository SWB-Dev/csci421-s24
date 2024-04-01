angular.module('bloggerApp').service('authentication', authentication);
    authentication.$inject = ['$window', '$http'];
    function authentication ($window, $http) {
        var saveToken = function (token) {
            $window.localStorage['blog-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['blog-token'];
        };

        var getPayload = function (token) {
            try {
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload;
            } catch (e) {
                return null;
            }
        };

        var register = function (user) {
            console.log('Registering user ' + user.email);
            return $http.post('/api/register', user)
                .then((data) => {
                    var token = data.data.token;
                    console.log("AUTH SERVICE: Register success");
                    saveToken(token);
                })
                .catch((e) => console.log(e));
        };

        var login = function (user) {
            return $http.post('/api/login', user)
                .then((data) => {
                    var token = data.data.token;
                    console.log('AUTH SERVICE: Login success');
                    saveToken(token);
                })
                .catch((e) => console.log(e));
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
                console.log("AUTH SERVICE: Current user", JSON.stringify(payload));
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
            isLoggedIn: isLoggedIn,
            currentUser: currentUser
        };
    };