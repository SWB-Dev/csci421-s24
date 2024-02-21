var second = 1000;
var minute = second * 60;
var hour = minute * 60;
var day = hour * 24;
var dtNow = Date.now();

var mongoose = require('mongoose');
var Blog = mongoose.model('Blogs')

var blogs = [
    {
        blogTitle: "My first blog!",
        blogText: "This is my first blog.",
        createdOn: new Date(dtNow - (day*(dtNow % 13)))
    },
    {
        blogTitle: "A second blog.",
        blogText: "The second blog shows how we iterate an array of objects using a pug template.",
        createdOn: new Date(dtNow - (hour*(dtNow % 15)))
    },
    {
        blogTitle: "Now we're getting MEAN!",
        blogText: "Being MEAN is a big change for me.  I'm use to being as nice as I can!",
        createdOn: new Date(dtNow - (minute*(dtNow % 19)))
    }
]

var sendJSONresponse = function (res, status, content) {
    res.status (status);
    res.json (content);
  };

var instantiateBlog = function (body) {
    return {
        blogTitle: body.blogTitle,
        blogText: body.blogText
    }
}

module.exports.blogList = function (req, res) {
    console.log ("*****Request sent to API*****")
    Blog.find()
        .then(function(blogs) {
            sendJSONresponse (res, 200, blogs)
        })
        .catch(function(err) {
            console.log(err)
        })
}

module.exports.blogFindOne = function (req, res) {
    var blogId = req.body.blogId;
    console.log("API finding blog: "+blogId)
    Blog.findOne({_id:blogId})
    .then(function(blog) {
        console.log("API: "+blog)
        sendJSONresponse (res, 200, blog);
    })
    .catch(function(err) {
        console.log(err)
    })
}

module.exports.blogAdd = function (req, res) {
    console.log ("*****Request sent to API*****")
    var blog = instantiateBlog (req.body)
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
    console.log("****Request sent to API*****");

}