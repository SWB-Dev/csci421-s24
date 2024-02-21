const { response } = require('express');
var request = require('request');

var apiOptions = {
    server: "http://localhost:"+process.env.PORT
}

var renderBlogList = function (req, res, responseBody) {
    var message;
    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No blogs to display."
        }
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

module.exports.blogList = function(req, res) {
    var requestOptions, path;
    path = '/api/blog';
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

var blogFindOne = function (req, res, callback) {
    console.log("User requested Blog ID: " + req.params.blogId)
    var requestOptions, path, blogId;
    var blogId = req.params.blogId;
    path = '/api/blog/'+blogId;

    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    }

    request(
        requestOptions,
        function (err, response, body) {
            if (response.statusCode == 200) {
                callback(req, res, body)
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
    path = '/api/blog/add';

    blogData = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText
    };

    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
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
            if (response.statusCode === 201) {
                console.log(res.body);
                res.redirect('/blog');
            }
        }
    )
}

module.exports.blogEdit = function(req, res) {
    console.log("User requested Blog ID: " + req.params.blogId)
    blogFindOne(res, req, renderBlogEdit)
    // res.render('blog/blog-edit', {title: 'Edit Blog'});
}

module.exports.doBlogEdit = function(req, res) {
    console.log("User requested Blog ID: " + req.params.blogid)
    console.log("***** POST New Blog Form *****");
    var requestOptions, path, blogData;
    path = '/api/blog/add';

    blogData = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText
    };

    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
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
            if (response.statusCode === 201) {
                console.log(res.body);
                res.redirect('/blog');
            }
        }
    )
}

module.exports.blogDelete = function(req, res) {
    console.log("User requested Blog ID: " + req.params.blogid)
    res.render('blog/blog-delete', {title: 'Delete Blog'});
}