var isBlogAuthor = function (blog) {
    console.log("Checking blog author...")
    var currentUser = authentication.currentUser();
    return authentication.isLoggedIn() && currentUser.email === blog.authorEmail;
};


angular.
    module('blogger').
    component('blogList', {
        templateUrl: 'blogger/templates/bloglist.template.html',
        controller: function BlogListController ($http, authentication) {
            var ctrl = this;
            ctrl.title = "View Blogs";
            
            ctrl.isCurrentUser = isBlogAuthor;

            $http.get('/api/blog')
                .then((value) => {
                    ctrl.data = value.data;
                })
                .catch((e) => console.log(e));
        }
    });

angular.
    module('blogger').
    component('blogAdd', {
        templateUrl: 'blogger/templates/addblog.template.html',
        controller: function BlogAddController ($http, $location, authentication) {
            var ctrl = this;
            ctrl.title = 'Add Blog';
            ctrl.onSubmit = function () {
                console.log(ctrl.formData);
                var headers = {
                    Authorization: 'Bearer ' + authentication.getToken()
                };
                $http.post('/api/blog/add', ctrl.formData, {headers: headers})
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
        controller: function BlogEditController ($routeParams, $http, $location, authentication) {
            var ctrl = this;
            ctrl.title = "Edit Blog";
            ctrl.blogId = $routeParams.blogId;
            $http.get('/api/blog/' + ctrl.blogId)
                .then((value) => {
                    if (value.status === 400) {
                        $location.path('/not-found');
                    } else {
                        ctrl.blog = value.data;
                        ctrl.formData = ctrl.blog;
                    }
                })
                .catch((e) => {
                    console.log(e);
                    $location.path('/not-found')
                });

            if (!isBlogAuthor(ctrl.blog)) {
                $location.path('/blogs');
            }

            ctrl.onSubmit = () => {
                var headers = {
                    Authorization: 'Bearer ' + authentication.getToken()
                };
                $http.put('/api/blog/'+ctrl.blogId, ctrl.formData, {headers: headers})
                    .then((value) => {
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

            ctrl.onCancel = () => $location.path('/blogs');
        }
    });

angular.
    module('blogger').
    component('blogDelete', {
        templateUrl: 'blogger/templates/deleteblog.template.html',
        controller: function BlogDeleteController ($routeParams, $http, $location, authentication) {
            var ctrl = this;
            ctrl.title = "Delete Blog";
            ctrl.blogId = $routeParams.blogId;
            $http.get('/api/blog/' + ctrl.blogId)
                .then((value) => {
                    if (value.status == 400) {
                        $location.path('/not-found');
                    } else {
                        ctrl.blog = value.data;
                        ctrl.formData = ctrl.blog;
                    }
                })
                .catch((e) => {
                    console.log(e);
                    $location.path('/not-found')
                });
            
            ctrl.onSubmit = function () {
                var headers = {
                    Authorization: 'Bearer ' + authentication.getToken()
                };
                $http.delete('/api/blog/'+ctrl.blogId, {headers: headers})
                    .then((value) => {
                        $location.path('/blogs');
                    })
                    .catch((e) => console.log(e));
            };

            ctrl.onCancel = function () {
                $location.path('/blogs');
            };
        }
    });