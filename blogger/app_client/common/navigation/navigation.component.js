angular
    .module('common')
    .component('navigation', {
        templateUrl: 'common/navigation/navigation.template.html',
        controller: function NavigationController ($location, authentication) {
            var ctrl = this;
            ctrl.currentPath = $location.path();
            ctrl.currentUser = function () {
                return authentication.currentUser();
            };

            ctrl.isLoggedIn = function () {
                var token = authentication.getToken();
                authentication.getPayload(token);
                return authentication
                    .isLoggedIn();
            };

            ctrl.logout = function () {
                authentication.logout();
                $location.path('/');
            }
        }
    });