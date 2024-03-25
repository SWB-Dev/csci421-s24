
// angular.
//     module('bloggerApp').
//     controller('BlogListController', BlogListController);

// BlogListController.$inject = ['bloggerData'];
// function BlogListController ($scope, bloggerData) {
//     var ctrl = this;
//     ctrl.data = bloggerData.getAllBlogs()
//         .success((data) => {
//             ctrl.data = data;
//         })
//         .error((e) => console.log(e));
// };

angular.
    module('blogger').
    component('blogList', {
        templateUrl: 'blogger/templates/bloglist.template.html',
        controller: function BlogListController ($scope, $http) {
            var ctrl = this;
            $http.get('/api/blog')
                .then((value) => {
                    console.log(value);
                    ctrl.data = value.data;
                })
                .catch((e) => console.log(e));
        }
    });

angular.
    module('blogger').
    component('blogAdd', {
        templateUrl: 'blogger/templates/addblog.template.html',
        controller: function BlogAddController ($scope, $http, $location) {
            var ctrl = this;
            ctrl.title = 'Add Blog';
            ctrl.onSubmit = function () {
                console.log(ctrl.formData);
                $http.post('/api/blog/add', ctrl.formData)
                    .then((v) => {
                        $location.path('/blogs')
                    })
                    .catch((e) => console.log(e));
            };
        }
    });