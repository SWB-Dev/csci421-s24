const { response } = require('express');
var request = require('request');

var apiOptions = {
    server: "http://localhost:"+process.env.PORT,
    uri: {
        blog: {
            add: "/api/blog/add",
            all: "/api/blog",
            one: "/api/blog/"
        }
    },
    status: {
        blog: {
            200: "This Blog accepts your call.  Blog found!",
            201: "You have giveth substance to the aether.  Blog created!",
            204: "The aether winces.  Blog deleted!",
            400: "The aether is unsure of your intentions.  Bad request!",
            404: "This is not the Blog you are looking for.  Blog not found!",
        }
    }
}

var renderBlogList = function (req, res, responseBody) {
    var message;
    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else if (!responseBody.length) {
        message = "No blogs to display."
    } else {
        message = apiOptions.status.blog[req.statusCode]
    }

    res.render('blog/blog-list', {
        title: "Blog List",
        blogs: responseBody,
        message: message
    })
}

var renderBlogEdit = function (req, res, responseBody) {
    var message;
    if (!responseBody) {
        message = "API lookup error";
        responseBody = {}
    }

    res.render('blog/blog-edit', {
        title:"Blog Edit",
        blog: responseBody,
        message: message
    })
}

var renderBlogDelete = function (req, res, responseBody) {
    var message;
    if (!responseBody) {
        message = "API lookup error";
        responseBody = {}
    }

    res.render('blog/blog-delete', {
        title:"Blog Delete",
        blog: responseBody,
        message: message
    })
}

var blogFindOne = function (req, res, callback) {
    console.log("blogFindOne: " + req.params.blogId)
    var requestOptions, path, blogId;
    var blogId = req.params.blogId;
    // path = '/api/blog/'+blogId;
    path = apiOptions.uri.blog.one + blogId;

    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    }

    request(
        requestOptions,
        function (err, response, body) {
            if (response.statusCode == 200) {
                console.log(body)
                callback(req, res, body)
            }
        }
    )
}

module.exports.blogList = function(req, res) {
    var requestOptions, path;
    // path = '/api/blog';
    path = apiOptions.uri.blog.all;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };

    request(
        requestOptions,
        function (err, response, body) {
            var data;
            data = body;
            if (response.statusCode === 200 && data.length) {
                renderBlogList (req, res, data);
            }
        }
    )
}

module.exports.blogNew = function (req, res) {
    console.log("***** GET New Blog Form *****");
    res.render('blog/blog-add', {title:"New Blog"});
}

module.exports.blogAdd = function(req, res) {
    console.log("***** POST New Blog Form *****");
    var requestOptions, path, blogData;
    // path = '/api/blog/add';
    path = apiOptions.uri.blog.add;

    blogData = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText
    };

    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: blogData
        // json: {
        //     blogTitle: req.body.blogTitle,
        //     blogText: req.body.blogText
        // }
    };

    request(
        requestOptions,
        function (err, response, body) {
            var data;
            data = body;
            if (response.statusCode === 201) {
                console.log(res.body);
                res.redirect('/blog');
            }
        }
    )
}

module.exports.blogEdit = function(req, res) {
    console.log("blogEdit: " + req.params.blogId)
    blogFindOne(req, res, renderBlogEdit)
    // res.render('blog/blog-edit', {title: 'Edit Blog'});
}

module.exports.doBlogEdit = function(req, res) {
    console.log("doBlogEdit: " + req.params.blogId)
    console.log("***** PUT Edit Blog Form *****");
    var requestOptions, path, blogId, blogData;
    blogId = req.params.blogId;
    // path = '/api/blog/'+blogId;
    path = apiOptions.uri.blog.one + blogId;

    blogData = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText
    };

    requestOptions = {
        url: apiOptions.server + path,
        method: "PUT",
        json: {
            blogTitle: req.body.blogTitle,
            blogText: req.body.blogText
        }
    };

    request(
        requestOptions,
        function (err, response, body) {
            var data;
            data = body;
            if (response.statusCode === 200) {
                console.log(body);
                res.redirect('/blog');
            }
        }
    )
}

module.exports.doBlogDelete = function(req, res) {
    console.log("blogDelete: " + req.params.blogid)
    var requestOptions, path, blogId;
    blogId = req.params.blogId;
    // path = '/api/blog/'+blogId;
    path = apiOptions.uri.blog.one + blogId;

    requestOptions = {
        url: apiOptions.server + path,
        method: "DELETE",
        json: {}
    };
    request(
        requestOptions,
        function (err, response, body) {
            if (response.statusCode === 204) {
                res.redirect('/blog')
            } else {
                console.log(err)
            }
        }
    )
}

module.exports.blogDelete = function (req, res) {
    console.log("blogEdit: " + req.params.blogId)
    blogFindOne(req, res, renderBlogDelete)
}