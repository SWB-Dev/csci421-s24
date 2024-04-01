
angular.
module('bloggerApp').
config(['$routeProvider',
    function config($routeProvider) {
        $routeProvider.
            when('/', {
                template: '<greet-user></greet-user>'
            })
            .when('/blogs', {
                template:'<blog-list></blog-list>'
            })
            .when('/blogs/add', {
                template: '<blog-add></blog-add>'
            })
            .when('/blogs/edit/:blogId', {
                template: '<blog-edit></blog-edit>'
            })
            .when('/blogs/delete/:blogId', {
                template: "<blog-delete></blog-delete>"
            })
            .when('/not-found', {
                template: '<not-found></not-found>'
            })
            .when('/login', {
                template: "<login></login>"
            })
            .when('/register', {
                template: '<register></register>'
            })
            .when('/logout', {})
            .otherwise('/not-found');
    }
]);