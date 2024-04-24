var mongoose = require('mongoose');

var slimUserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
});

slimUserSchema.methods.equals = (id) => this.userId === id;

var pictionaryWordBankSchema = new mongoose.Schema({
    word: {
        type: String,
        unique: true,
        required: true
    },
    hint: {
        type: String,
        required: true
    }
});

var pictionaryLeaderboardSchema = new mongoose.Schema({
    user: slimUserSchema,
    userScore: {
        type: Number,
        "default": 0
    }
});

var pictionaryConnectedUserSchema = new mongoose.Schema({
    user: slimUserSchema,
    lastSeen: {
        type: Date,
        required: true
    }
});

var pictionaryRoundUserSchema = new mongoose.Schema({
    user: slimUserSchema,
    role: {
        type: String,
        enum: ['draw', 'guess'],
        required: true
    },
    roundNumber: {
        type: Number,
        required: true
    }
});

var pictionaryRoundImageSchema = new mongoose.Schema({
    imageData: {
        type: String,
        required: true
    },
    clearedCanvas: {
        type: Boolean,
        "default": false
    },
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

var pictionaryRoundGuessSchema = new mongoose.Schema({
    user: slimUserSchema,
    word: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        "default": Date.now
    }
});

var pictionaryRoundSchema = new mongoose.Schema({
    roundNumber: {
        type: Number,
        required: true
    },
    roundStatus: {
        type: String,
        enum: ['waiting','active', 'complete'],
        required: true
    },
    createdOn: {
        type: Date,
        "default": Date.now
    },
    word: {
        type: String,
        required: true
    },
    hint: {
        type: String,
        required: true
    },
    roundUsers: {
        type: [pictionaryRoundUserSchema],
        "default": []
    },
    imageData: {
        type: [pictionaryRoundImageSchema],
        "default": []
    },
    roundGuesses: [pictionaryRoundGuessSchema]
});

pictionaryRoundSchema.methods.isActive = function () {
    return this.roundStatus === 'active';
};

pictionaryRoundSchema.methods.isWaiting = function () {
    return this.roundStatus === 'waiting';
};

pictionaryRoundSchema.methods.isComplete = function () {
    return this.roundStatus === 'complete';
};

pictionaryRoundSchema.methods.addUser = function (user, role) {
    var u = this.roundUsers.find((u) => u.user.userId === user.user.userId);
    if (!u) {
        this.roundUsers.push({
            user: user.user,
            role: role,
            roundNumber: this.roundNumber
        });
    }
};

pictionaryRoundSchema.methods.getWinners = function() {
    var winners = this.roundGuesses.filter((g) => g.word.toUpperCase() === this.word.toUpperCase());
    return winners;
};

pictionaryRoundSchema.methods.addDrawImage = function (data, clearedCanvas) {
    this.imageData.push({
        imageData: data,
        clearedCanvas: clearedCanvas
    });
};

pictionaryRoundSchema.methods.getUserRole = function (user) {
    var u = this.roundUsers.find((u) => u.user.userId === user._id);
    if (u) {
        return u.role;
    }
    return null;
};

pictionaryRoundSchema.methods.getLastDrawImage = function () {
    return this.imageData.at(-1);
};

pictionaryRoundSchema.methods.aggregateGuesses = function () {
    var guesses = new Map();
    this.roundGuesses.forEach((g) => {
        var count = guesses.get(g.word);
        if (count) {
            ++count;
            guesses.set(g.word, count);
        } else {
            guesses.set(g.word, 1);
        }
    });
    return guesses;
};

pictionaryRoundSchema.methods.addGuess = function (user, guess) {
    this.roundGuesses.push({
        user: {
            userId: user._id,
            userName: user.name
        },
        word: guess
    });
    return this.word.toUpperCase() === guess.toUpperCase();
};

var pictionarySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    wordBank: [pictionaryWordBankSchema],
    leaderboard: [pictionaryLeaderboardSchema],
    rounds: {
        type: [pictionaryRoundSchema],
        "default": []
    },
    connectedUsers: [pictionaryConnectedUserSchema]
});

pictionarySchema.methods.addWords = function (words) {
    words.forEach((w) => this.wordBank.push(w));
};

pictionarySchema.methods.getActiveRound = function () {
    return this.rounds.find((r) => r.isActive());
};

pictionarySchema.methods.getWaitingRound = function () {
    return this.rounds.find((r) => r.isWaiting());
};

pictionarySchema.methods.getConnectedUsers = function () {
    var d = Date.now;
    // return this.connectedUsers.filter((u,i,a) => (d - u.lastSeen) < 60000);
    return this.connectedUsers;
};

pictionarySchema.methods.connectUser = function (user) {
    var connectedUser = this.connectedUsers.find((u) => u.user.userId === user._id);
    if (connectedUser) {
        // console.log("Found connected user: "+connectedUser);
        connectedUser.lastSeen = Date.now();
    } else {
        connectedUser = {
            user: {
                userId: user._id,
                userName: user.name
            },
            lastSeen: Date.now()
        };
        this.connectedUsers.push(connectedUser);
    }
    var r = this.getActiveRound();
    if (!r) {
        r = this.getWaitingRound();
    }
    if (r) {
        r.addUser(connectedUser, 'guess');
    }
};

pictionarySchema.methods.disconnectUser = function (user) {
    var u = this.connectedUsers.find((u) => u.user.userId === user._id);
    if (u) {
        this.connectedUsers = this.connectedUsers.filter((u) => u.user.userId !== user._id);
        var r = this.getActiveRound();
        if (r) {
            if (r.getUserRole(user) === 'draw') {
                this.endRound();
            }
            return;
        }
        r = this.getWaitingRound();
        if (r && r.getUserRole(user) === 'draw') {
            this.rounds = this.rounds.filter((r) => !r.isWaiting());
            this.createRound();
        }
    }
};

pictionarySchema.methods.getNextDrawer = function (users) {
    if (!users) {
        return null;
    }
    return users[(Math.floor(Math.random() * users.length))];
};

pictionarySchema.methods.getNextRandomItem = function (arr) {
    if (!arr) {
        return null;
    }
    return arr[(Math.floor(Math.random() * arr.length))];
}

pictionarySchema.methods.getNextRoundNumber = function () {
    var max = 0;
    this.rounds.forEach((r) => {
        if (r.roundNumber > max) {
            max = r.roundNumber;
        }
    });
    ++max;
    return max;
};

pictionarySchema.methods.createRound = function () {
    var connected = this.getConnectedUsers();
    var drawer = this.getNextDrawer (connected);
    if (!drawer) {
        return;
    }
    var roundNbr = this.getNextRoundNumber();
    var word = this.getNextRandomItem(this.wordBank);
    var users = []
    connected
        .filter((u) => u.user.userId !== drawer.user.userId)
        .forEach((u) => {
            users.push({
                user: u.user,
                role: 'guess',
                roundNumber: roundNbr
            });
        })
    users.push({
        user: drawer.user,
        role: 'draw',
        roundNumber: roundNbr
    });
    var round = {
        roundNumber: roundNbr,
        roundStatus: 'waiting',
        word: word.word,
        hint: word.hint,
        roundUsers: users,
        imageData: [],
        roundGuesses: []
    };
    this.rounds.push(round);
    return round;
};

pictionarySchema.methods.startRound = function () {
    if (this.getActiveRound()) {
        return null;
    }
    var r = this.getWaitingRound();
    r.roundStatus = 'active';
    r.createdOn = Date.now();
};

pictionarySchema.methods.endRound = function() {
    var r = this.getActiveRound();
    if (r) {
        this.calculateScores();
        r.roundStatus = 'complete';
    }
};

pictionarySchema.methods.calculateScores = function () {
    var r = this.getActiveRound();
    if (r) {
        var t = r.createdOn.getTime();
        var w = r.word.toUpperCase();
        var guessers = r.roundGuesses.filter((g) => g.word.toUpperCase() == w);
        guessers.forEach((g) => {
            var secs = (g.createdOn - t)/10000;
            var score = 10 - parseInt(secs);
            console.log(score);
            if (score > 0) {
                var u = this.leaderboard.find((u) => u.user.userId === g.user.userId);
                if (u) {
                    u.userScore += score;
                } else {
                    this.leaderboard.push({
                        user: g.user,
                        userScore: score
                    });
                }
            }
        });
    }
};

// mongoose.model('PictionaryConnectUsers', pictionaryConnectedUserSchema);
mongoose.model('Pictionary', pictionarySchema);