module.exports.blogList = function(req, res) {
    res.render('blog/blog-list', { title: 'Blog List' })
}

module.exports.blogAdd = function(req, res) {
    res.render('blog/blog-add', { title: 'Blog Add' })
}