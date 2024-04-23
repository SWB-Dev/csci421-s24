var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

var ctrlBlogs = require('../controllers/blog');
var ctrlPictionary = require('../controllers/pictionary');
var ctrlAuth = require('../controllers/authentication');

router.get('/blog', ctrlBlogs.blogList);
router.post('/blog/add', auth, ctrlBlogs.blogAdd);
router.get('/blog/:blogId', ctrlBlogs.blogFindOne);
router.put('/blog/:blogId', auth, ctrlBlogs.blogEdit);
router.delete('/blog/:blogId', auth, ctrlBlogs.blogDelete);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// PICTIONARY
router.get('/pictionary', ctrlPictionary.getPictionary);
router.post('/pictionary/create', auth, ctrlPictionary.createPictionary);
router.post('/pictionary/connectUser', auth, ctrlPictionary.connectUser);
router.post('/pictionary/createRound', auth, ctrlPictionary.createRound);
router.post('/pictionary/startRound', auth, ctrlPictionary.startRound);
router.get('/pictionary/getGameTick', auth, ctrlPictionary.getGameTick);
router.delete('/pictionary/clearGame', auth, ctrlPictionary.clearGame);
router.post('/pictionary/addWords', auth, ctrlPictionary.addWords);
router.post('/pictionary/endRound', auth, ctrlPictionary.endRound);
router.post('/pictionary/submitGuess', auth, ctrlPictionary.submitGuess);
router.post('/pictionary/updateDrawImage', auth, ctrlPictionary.updateDrawImage);
router.delete('/pictionary/disconnectUser', auth, ctrlPictionary.disconnectUser);

module.exports = router;