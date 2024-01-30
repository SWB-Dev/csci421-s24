var express = require('express');
var router = express.Router();

/* GET biography page */
router.get('/', function (req, res, next) {
    res.render('biography', {title:"Biography"})
})

module.exports = router;