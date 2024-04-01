var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

var ctrlBlogs = require('../controllers/blog');
var ctrlAuth = require('../controllers/authentication');

router.get('/blog', ctrlBlogs.blogList);
router.post('/blog/add', auth, ctrlBlogs.blogAdd);
router.get('/blog/:blogId', ctrlBlogs.blogFindOne);
router.put('/blog/:blogId', auth, ctrlBlogs.blogEdit);
router.delete('/blog/:blogId', auth, ctrlBlogs.blogDelete);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;