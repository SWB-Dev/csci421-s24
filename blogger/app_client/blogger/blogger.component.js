angular.
    module('blogger').
    component('blogList', {
        templateUrl: 'blogger/blogger.template.html',
        controller: function BlogListController ($scope) {
            var ctrl = this;
            ctrl.data = [
                {__id:1, blogTitle:"Blog Title 1", blogText:"Blog text 1"},
                {__id:2, blogTitle:"Blog Title 2", blogText:"Blog text 2"}
            ]
        }
    });