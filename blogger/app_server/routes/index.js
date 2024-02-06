var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/* GET home page */
router.get('/', ctrlHome.home);

/* BLOG ENDPOINTS */

/* GET blog list page */
router.get('/blog', ctrlBlog.blogList);

/* GET blog add page */
router.get('/blog/add', ctrlBlog.blogAdd);

module.exports = router;