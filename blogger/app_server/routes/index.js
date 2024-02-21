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
router.get('/blog/add', ctrlBlog.blogNew);

router.post('/blog/add-blog', ctrlBlog.blogAdd)

/* GET blog edit page */
router.get('/blog/:blogid/edit', ctrlBlog.blogEdit);

/* GET blog delete page */
router.get('/blog/:blogid/delete', ctrlBlog.blogDelete);

module.exports = router;