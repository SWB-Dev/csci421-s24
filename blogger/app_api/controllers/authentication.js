var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function(req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message":"All fields required."
        });
        return;
    }

    var userData = {
        name: req.body.name,
        email: req.body.email
    };

    User.create(userData)
        .then((user) => {
            user.setPassword(req.body.password);
            user.save();
            token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token":token
            });
        })
        .catch((error) => {
            console.log('AUTH API: Register error ' + error);
            sendJSONresponse(res, 404, error);
        });
};

module.exports.login = function(req, res) {
    if (!req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            "message":"All fields required."
        });
        return;
    }

    passport.authenticate('local', function(err, user, info) {
        var token;
        if (err) {
            console.log("AUTH ERROR: Login " + err);
            sendJSONresponse(res, 404, err);
            return;
        }

        if (user) {
            token = user.generateJwt();
            sendJSONresponse(res, 200, {
                "token":token
            });
        } else {
            console.log('Auth API: ' + info.message);
            sendJSONresponse(res, 401, info);
        }
    })(req, res);
};