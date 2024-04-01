angular.
    module('common').
    component('notFound', {
        templateUrl: 'common/templates/notfound.template.html',
        controller: function NotFoundController($scope) {
            this.message = 'Not Found!';
        }
    });

angular.
    module('common').
    component('greetUser', {
        templateUrl: 'common/templates/greetuser.template.html',
        controller: function GreetUserController($scope) {
            this.title = "Steven Barnes";
        }
    });