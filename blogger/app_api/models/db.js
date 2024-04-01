var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = process.env.BLOGGER_DB_URI;

mongoose.connect(dbURI);

// Monitor and report when database in connected
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

// Monitor and report error connecting to database
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});

// Monitor and report when database is disconnected
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

// Closes (disconnects) from Mongoose DB upon shitdown
gracefulShutdown = function (msg, callback) {
    mongoose.connection.close()
        .then(function () {
            console.log('Mongoose disconnected through ' + msg);
            callback();
        })
        .catch((err) => console.log(err));
};

// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});

// For Lightsail app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Lightsail app shutdown', function() {
        process.exit(0);
    });
});

require('./blogs');
require('./users');