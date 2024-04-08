var mongoose = require('mongoose');
var Blog = mongoose.model('Blogs')

var sendJSONresponse = function (res, status, content) {
    res.status (status);
    res.json (content);
};

var instantiateBlog = function (body) {
    return {
        blogTitle: body.blogTitle,
        blogText: body.blogText
    }
};

var isBlogAuthor = (blog, user) => blog.authorEmail === user.email;

module.exports.blogList = function (req, res) {
    console.log ("*****Request sent to API: blogList*****")
    Blog.find()
        .then(function(blogs) {
            if (!blogs.length) {
                sendJSONresponse (res, 204, blogs)
            } else {
                sendJSONresponse (res, 200, blogs)
            }
        })
        .catch(function(err) {
            console.log(err);
            sendJSONresponse (res, 400, err)
        })
}

module.exports.blogFindOne = function (req, res) {
    var blogId = req.params.blogId;
    console.log("API finding blog: "+blogId)
    Blog.findOne({_id:blogId})
    .then(function(blog) {
        console.log("API: "+blog)
        if (blog) {
            sendJSONresponse (res, 200, blog);
        } else {
            sendJSONresponse (res, 204, blog);
        }
    })
    .catch(function(err) {
        console.log(err);
        sendJSONresponse (res, 400, err);

    })
}

module.exports.blogAdd = function (req, res) {
    console.log ("*****Request sent to API: blogAdd*****");
    var user = req.payload;
    var blog = instantiateBlog (req.body)
    blog['authorEmail'] = user.email;
    blog['authorName'] = user.name;
    Blog.create (blog)
        .then(function (newBlog) {
            console.log("***** Created blog *****\n"+newBlog)
            sendJSONresponse (res, 201, newBlog)
        })
        .catch(function(err) {
            console.log(err)
            sendJSONresponse (res, 400, err)
        })
}

module.exports.blogEdit = function (req, res) {
    console.log("****Request sent to API: blogEdit*****");
    var blogId = req.params.blogId;
    var updates = {$set: {  
        "blogTitle": req.body.blogTitle,
        "blogText": req.body.blogText
    }}

    Blog.findOne({_id:blogId})
    .then(function(blog) {
        console.log("API: "+blog);
        if (blog) {
            if (!isBlogAuthor(blog, req.payload)) {
                sendJSONresponse(res, 401, blog);
            }
        } else {
            sendJSONresponse (res, 204, blog);
        }
    })
    .catch(function(err) {
        console.log(err);
        sendJSONresponse (res, 400, err);

    });

    Blog.findByIdAndUpdate(blogId, updates)
        .then(function(blog) {
            console.log("***** Updated blog: "+blogId+" *****");
            sendJSONresponse (res, 200, blog);
        })
        .catch(function(err) {
            console.log(err);
            sendJSONresponse (res, 404 ,err);
        });

}

module.exports.blogDelete = function (req, res) {
    console.log("****Request sent to API: blogDelete*****");
    var blogId = req.params.blogId;

    Blog.findOne({_id:blogId})
    .then(function(blog) {
        console.log("API: "+blog);
        if (blog) {
            if (!isBlogAuthor(blog, req.payload)) {
                sendJSONresponse(res, 401, blog);
            }
        } else {
            sendJSONresponse (res, 204, blog);
        }
    })
    .catch(function(err) {
        console.log(err);
        sendJSONresponse (res, 400, err);

    });

    Blog.findByIdAndDelete(blogId)
        .then(() => sendJSONresponse (res, 204, null))
        .catch((err) => sendJSONresponse (res, 404, err));
}