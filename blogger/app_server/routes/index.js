var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home')

router.get('/', ctrlHome.index)
