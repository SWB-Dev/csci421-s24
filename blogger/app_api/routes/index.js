var express = require('express');
var router = express.Router();

var ctrlBlogs = require('../controllers/blog')

router.get('/blog', ctrlBlogs.blogList)

module.exports = router;