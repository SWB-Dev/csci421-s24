var mongoose = require('mongoose');
var Pictionary = mongoose.model('Pictionary');


const GAME_NAME = "Pictionary1";

var sendJSONresponse = function (res, status, content) {
    res.status (status);
    res.json (content);
};

module.exports.addWords = function (req, res) {
    var words = JSON.parse(req.body.words);
    console.log(words);
    var game = null;
    Pictionary.findOne({name:GAME_NAME})
        .then((p) => {
            p.addWords(words);
            p.save()
                .then(() => sendJSONresponse (res, 201, p));
        })
        .catch((e) => {
            console.log(e);
            sendJSONresponse (res, 400, game);
        });
};

module.exports.createPictionary = function (req, res) {
    Pictionary.find()
        .then((p) => {
            if (!p || !p.length) {
                Pictionary.create({name:GAME_NAME})
                    .then((p2) => sendJSONresponse(res, 200, p2));
                return;
            }
            sendJSONresponse(res, 200, p)
        });
};

module.exports.getPictionary = function (req, res) {
    Pictionary.find()
        .then((p) => sendJSONresponse(res, 200, p));
}

module.exports.connectUser = function (req, res) {
    console.log("*****Request sent to API: pictionary/connectUser");
    var user = req.payload;
    Pictionary.findOne({name:GAME_NAME})
        .then((p) => {
            p.connectUser(user);
            p.save()
                .then(() => sendJSONresponse(res, 200, [user, "connected"]))
                .catch((e) => {
                    console.log(e);
                    sendJSONresponse(res, 200, [user, "failed"]);
                });
        })
        .catch((e) => {
            console.log(e);
            sendJSONresponse(res, 200, [user, "failed"]);
        });  
};

module.exports.disconnectUser = function (req, res) {
    var user = req.payload;
    Pictionary.findOne({name:GAME_NAME})
        .then((p) => {
            p.disconnectUser(user);
            p.save()
                .then(() => sendJSONresponse(res, 200, [user, "disconnected"]));
        })
        .catch((e) => {
            console.log(e);
            sendJSONresponse(res, 200, [user, "failed"]);
        });
};

module.exports.updateDrawImage = function (req, res) {
    var user = req.payload;
    var imageData = req.body.imageData;
    var clearedCanvas = req.body.clearedCanvas;
    Pictionary.findOne({name:GAME_NAME})
        .then((p) => {
            var r = p.getActiveRound();
            if (r) {
                r.addDrawImage(imageData, clearedCanvas);
                p.save()
                    .then(() => sendJSONresponse(res, 201, null))
                    .catch((e) => {
                        console.log(e);
                        sendJSONresponse(res, 200, null);
                    });
            }
        })
        .catch((e) => console.log(e))
}

module.exports.getGameTick = function (req, res) {
    var user = req.payload;
    var tickData = {
        status: null,
        guesses: null,
        wordInfo: {
            role: "",
            value: "",
            isCorrect: false
        },
        imageData: null,
        roundStart: null,
        leaderboard: {}
    };
    Pictionary.findOne({name:GAME_NAME})
        .then((p) => {
            var r = p.getActiveRound();
            var scores = {};
            p.leaderboard.forEach((u) => scores[u.user.userName] = u.userScore);
            tickData.leaderboard = scores;
            if (r) {
                var role = r.getUserRole(user);
                tickData.status = r.roundStatus;
                tickData.wordInfo.value = r.hint;
                tickData.guesses = Object.fromEntries(r.aggregateGuesses());
                tickData.wordInfo.role = role;
                tickData.wordInfo.isCorrect = r.getWinners().some((u) => u.user.userId === user._id);
                tickData.imageData = r.getLastDrawImage();
                tickData.roundStart = r.createdOn.getTime();
                if (tickData.imageData && tickData.imageData.clearedCanvas) {
                    console.log("Canvas was cleared.");
                }
                if (role == 'draw') {
                    tickData.wordInfo.value = r.word;
                }
                sendJSONresponse(res, 200, tickData);
            } else {
                r = p.getWaitingRound();
                if (!r) {
                    p.createRound();
                    p.save()
                        .then(() => sendJSONresponse(res, 200, tickData))
                        .catch((e) => {
                            console.log(e);
                            sendJSONresponse(res, 200, null);
                        });
                    return;
                }
                var role = r.getUserRole(user);
                tickData.status = r.roundStatus;
                tickData.wordInfo.value = r.hint;
                tickData.wordInfo.role = r.getUserRole(user);
                if (role == 'draw') {
                    tickData.wordInfo.value = r.word;
                }
                sendJSONresponse(res, 200, tickData);
            }
        })
};

module.exports.submitGuess = function (req, res) {
    var user = req.payload;
    var guess = req.body.guess;
    Pictionary.findOne({name:GAME_NAME})
        .then((p) => {
            var r = p.getActiveRound();
            if (r) {
                var isCorrect = r.addGuess(user, guess);
                var word = isCorrect ? guess : null;
                p.save()
                    .then(() => sendJSONresponse (res, 200, {isCorrect: isCorrect, word: word}))
                    .catch((e) => {
                        console.log(e);
                        sendJSONresponse(res, 200, null);
                    });
            }
        })
        .catch((e) => {
            console.log(e);
            sendJSONresponse (res, 200, {isCorrect: false, word: null});
        });
};

module.exports.endRound = function (req, res) {
    var user = req.payload;
    Pictionary.findOne({name:GAME_NAME})
        .then((p) => {
            p.endRound();
            p.save()
                .then(() => sendJSONresponse (res, 200, p))
                .catch((e) => {
                    console.log(e);
                    sendJSONresponse(res, 200, null);
                });
        })
}

module.exports.createRound = function (req, res) {
    var user = req.payload;
    var game = null;
    Pictionary.findOne({name:GAME_NAME})
        .then((p) => {
            p.createRound();
            p.save()
                .then(() => sendJSONresponse (res, 200, p))
                .catch((e) => {
                    console.log(e);
                    sendJSONresponse(res, 200, null);
                });
        })
        .catch((e) => {
            console.log(e);
            sendJSONresponse (res, 400, e);
        });
};

module.exports.startRound = function (req, res) {
    Pictionary.findOne({name:GAME_NAME})
        .then((p) => {
            p.startRound();
            p.save()
                .then(() => sendJSONresponse (res, 200, p))
                .catch((e) => {
                    console.log(e);
                    sendJSONresponse(res, 200, null);
                });
        })
};

module.exports.clearGame = function (req, res) {
    Pictionary.findOne({name:GAME_NAME})
        .then((p) => {
            p.rounds = [];
            p.connectedUsers = [];
            p.save()
                .then(() => sendJSONresponse (res, 200, p))
                .catch((e) => {
                    console.log(e);
                    sendJSONresponse(res, 200, null);
                });
        })
        .catch((e) => console.log(e));
}