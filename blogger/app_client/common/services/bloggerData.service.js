angular.
    module('bloggerApp').
    service('bloggerData', bloggerData);

bloggerData.$inject = ['$http'];
function bloggerData ($http) {
    var getOneBlog = function(blogId) {
        return $http.get('/api/blog/' + blogId);
    };

    var getAllBlogs = function () {
        var data =  $http.get('/api/blog');
        console.log(data);
        return data;
    };

    return {
        getOneBlog : getOneBlog,
        getAllBlogs : getAllBlogs
    };
};