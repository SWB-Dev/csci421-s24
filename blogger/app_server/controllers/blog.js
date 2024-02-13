var second = 1000;
var minute = second * 60;
var hour = minute * 60;
var day = hour * 24;
var dtNow = Date.now();

var blogs = [
    {
        blogTitle: "My first blog!",
        blogText: "This is my first blog.",
        createdOn: new Date(dtnow - (day*(dtNow % 13)))
    },
    {
        blogTitle: "A second blog.",
        blogText: "The second blog shows how we iterate an array of objects using a pug template.",
        createdOn: new Date(dtnow - (hour*(dtNow % 15)))
    },
    {
        blogTitle: "Now we're getting MEAN!",
        blogText: "Being MEAN is a big change for me.  I'm use to being as nice as I can!",
        createdOn: new Date(dtnow - (minute*(dtNow % 19)))
    }
]

module.exports.blogList = function(req, res) {
    res.render('blog/blog-list', {
        title: 'Blog List',
        blogs: blogs
    });
}

module.exports.blogAdd = function(req, res) {
    res.render('blog/blog-add', { title: 'Blog Add' })
}