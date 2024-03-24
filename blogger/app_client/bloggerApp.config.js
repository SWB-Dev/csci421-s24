angular.
    module('bloggerApp').
    config(['$routeProvider',
        function config($routeProvider) {
            $routeProvider.
                when('/', {
                    template: '<greet-user></greet-user>'
                }).
                when('/blogs', {
                    template:'<blog-list></blog-list>'
                }).
                when('/not-found', {
                    template: '<not-found></not-found>'
                }).
                otherwise('/not-found')
        }
    ]);