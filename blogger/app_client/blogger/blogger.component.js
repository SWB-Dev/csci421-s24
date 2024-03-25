
angular.
    module('blogger').
    component('blogList', {
        templateUrl: 'blogger/templates/bloglist.template.html',
        controller: function BlogListController ($scope, $http) {
            var ctrl = this;
            ctrl.title = "View Blogs";
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

angular.
    module('blogger').
    component('blogEdit', {
        templateUrl: 'blogger/templates/editblog.template.html',
        controller: function BlogEditController ($scope, $routeParams, $http, $location) {
            var ctrl = this;
            ctrl.title = "Edit Blog";
            ctrl.blogId = $routeParams.blogId;
            console.log(ctrl.blogId);
            $http.get('/api/blog/' + ctrl.blogId)
                .then((value) => {
                    if (value.status === 400) {
                        $location.path('/not-found');
                    } else {
                        console.log(value);
                        ctrl.blog = value.data;
                        ctrl.formData = ctrl.blog;
                    }
                })
                .catch((e) => {
                    console.log(e);
                    $location.path('/not-found')
                });
            
            ctrl.onSubmit = function () {
                console.log(ctrl.formData);
                $http.put('/api/blog/'+ctrl.blogId, ctrl.formData)
                    .then((value) => {
                        console.log(value);
                        ctrl.blog = value.data;
                        ctrl.formData.blogTitle = ctrl.blog.blogTitle;
                        ctrl.formData.blogText = ctrl.blog.blogText;
                        $location.path('/blogs');
                    })
                    .catch((e) => {
                        console.log(e);
                        $location.path('/not-found')
                    });
            };

            ctrl.onCancel = function () {
                $location.path('/blogs');
            };
        }
    });

angular.
    module('blogger').
    component('blogDelete', {
        templateUrl: 'blogger/templates/deleteblog.template.html',
        controller: function BlogDeleteController ($scope, $routeParams, $http, $location) {
            var ctrl = this;
            ctrl.title = "Delete Blog";
            ctrl.blogId = $routeParams.blogId;
            console.log(ctrl.blogId);
            $http.get('/api/blog/' + ctrl.blogId)
                .then((value) => {
                    if (value.status == 400) {
                        $location.path('/not-found');
                    } else {
                        console.log(value);
                        ctrl.blog = value.data;
                        ctrl.formData = ctrl.blog;
                    }
                })
                .catch((e) => {
                    console.log(e);
                    $location.path('/not-found')
                });
            
            ctrl.onSubmit = function () {
                console.log(ctrl.formData);
                $http.delete('/api/blog/'+ctrl.blogId)
                    .then((value) => {
                        console.log(value);
                        $location.path('/blogs');
                    })
                    .catch((e) => console.log(e));
            };

            ctrl.onCancel = function () {
                $location.path('/blogs');
            };
        }
    });