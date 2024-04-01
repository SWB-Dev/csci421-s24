var passport = require('passport');
var LocalStategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStategy(
    {
        usernameField: 'email'
    },
    function(username, password, done) {
        User.findOne({ email: username})
            .then((user) => {
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username or password.'
                    });
                }
                if (!user.validatePassword(password)) {
                    return done(null, false, {
                        message: 'Incorrect username or password.'
                    });
                }
                return done(null, user);
            })
            .catch((error) => {return done(error)});
    }
));