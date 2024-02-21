var express = require('express');
var router = express.Router();

var ctrlBlogs = require('../controllers/blog');

router.get('/blog', ctrlBlogs.blogList);
router.post('/blog/add', ctrlBlogs.blogAdd);
router.get('/blog/:blogId', ctrlBlogs.blogFindOne);
router.post('/blog/:blogId', ctrlBlogs.blogEdit);

module.exports = router;