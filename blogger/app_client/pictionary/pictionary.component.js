angular.
    module('pictionary').
    component('pictionaryGame', {
        templateUrl: 'pictionary/pictionary.template.html',
        controller: function PictionaryGameController ($http, $scope, $interval, authentication) {
            var ctrl = this;
            ctrl.title = "Pictionary";
            ctrl.guess = "";
            ctrl.isCorrect = false;
            ctrl.isDrawing = false;
            ctrl.tickData = {}
            ctrl.playerInfo = {
                l: "Guessing",
                r: "",
                isCorrect: false,
                isDrawing: false
            }
            ctrl.leaderboard = {};
            ctrl.role = "Guessing"
            ctrl.word = ""
            ctrl.guesses = null;
            ctrl.user = authentication.currentUser();
            ctrl.headers = {
                Authorization: ''
            };
            ctrl.drawTimerSeconds = null;
            ctrl.intervalId = null;
            ctrl.intervals = [];
            ctrl.lastCapturedImage = null;
            ctrl.isSendingImage = false;
            ctrl.clearedCanvas = false;
            ctrl.getHeaders = function () {
                token = authentication.getToken();
                ctrl.headers.Authorization = 'Bearer '+token;
                return ctrl.headers;
            };

            ctrl.connectUser = function () {
                $http.post('/api/pictionary/connectUser', {}, {headers: ctrl.getHeaders()})
                    // .then((v) => console.log(v))
                    .catch((e) => console.log(e));
            }

            ctrl.startGame = function () {
                $http.post('/api/pictionary/startRound',{}, {headers: ctrl.getHeaders()})
                    // .then((v) => console.log(v))
                    .catch((e) => console.log(e));
            };

            ctrl.getGameState = function () {
                // console.log(document.getElementById("drawCanvas"));
                $http.get('/api/pictionary/getGameTick', {headers: ctrl.getHeaders()})
                    .then((v) => {
                        // console.log(v);
                        ctrl.tickData = v.data;
                        if (v.data.leaderboard) {
                            ctrl.leaderboard = Object.entries(v.data.leaderboard).sort((a,b) => b[1] - a[1]);
                        }
                        if (v.data.wordInfo.role === 'draw') {
                            ctrl.playerInfo.l = 'Drawing';
                            ctrl.isDrawing = true;
                            ctrl.playerInfo.isDrawing = true;
                        } else {
                            ctrl.playerInfo.l = 'Guessing';
                            ctrl.isDrawing = false;
                            ctrl.playerInfo.isDrawing = false;
                        }
                        if (v.data.status !== 'waiting') {
                            ctrl.playerInfo.r = v.data.wordInfo.value;
                            if (v.data.guesses) {
                                ctrl.guesses = Object.entries(v.data.guesses).sort((a,b) => b[1] - a[1]);
                            }
                            ctrl.setupGame();
                            if (!ctrl.isDrawing && v.data.imageData) {
                                var img = new Image(ctrl.canvas.getBoundingClientRect().x, ctrl.canvas.getBoundingClientRect().y);
                                img.src = v.data.imageData.imageData;
                                if (v.data.imageData.clearedCanvas) {
                                    ctrl.ctx.clearRect(0,0,600,350);
                                }
                                ctrl.ctx.drawImage(img,0,0);
                            }
                        }
                        if (v.data.status === 'active') {
                            ctrl.updateDrawTimer();
                        }
                        if (ctrl.playerInfo.isDrawing && v.data.status === 'active' && !ctrl.isSendingImage) {
                            ctrl.isSendingImage = true;
                            ctrl.captureDrawing();
                        }
                    })
                    .catch((e) => console.log(e));
            };

            ctrl.getPictionary = function () {
                $http.get('/api/pictionary')
                    // .then((v) => console.log(v))
                    .catch((e) => console.log(e));
            };
            
            ctrl.submitGuess = function () {
                $http.post('/api/pictionary/submitGuess', ctrl.formData, {headers: ctrl.getHeaders()})
                    .then((v) => {
                        console.log(v);
                        ctrl.isCorrect = v.data.isCorrect;
                        ctrl.formData.guess = "";
                    })
                    .catch((e) => console.log(e));
                    
            };

            ctrl.setupGame = function () {
                const canvas = document.getElementById("drawCanvas");
                ctrl.canvas = canvas;
                const ctx = canvas.getContext("2d");
                ctrl.ctx = ctx;
                const btnStartGame = document.getElementById("startGame");
                const btnCaptureDrawing = document.getElementById("captureDrawing");
                const btnClear = document.getElementById("clearCanvas");
                const pbElapsed = document.getElementById("pb-elapsed");
                ctrl.pbElapsed = pbElapsed;
                const pbRemaining = document.getElementById("pb-remaining");
                ctrl.pbRemaining = pbRemaining;
                const picTitle = document.getElementById("pic-title");
                const colorMap = document.getElementById("color-map");
                const guessList = document.getElementById("guess-list");
                var drawPos = [0,0];
                var isDrawing = false;
                var drawTimerSeconds = 0;
                var isDrawer = ctrl.isDrawing;

                if (ctrl.isDrawing) {
                    // console.log("Setting up game events.")
                    btnClear.addEventListener('click', () => {
                        ctx.clearRect(0,0,600,350);
                        ctrl.clearedCanvas = true;
                    });
                    canvas.addEventListener('mousedown', (event) => startDrawing(event));
                    canvas.addEventListener('mouseup', (event) => stopDrawing(event));
                    canvas.addEventListener('mousemove', (event) => userDraw(event));
                    colorMap.classList.remove("invisible");
                } else {
                    colorMap.classList.add("invisible");
                    btnClear.removeEventListener('click', () => {
                        ctx.clearRect(0,0,600,350);
                        ctrl.clearedCanvas = true;
                    });
                    canvas.removeEventListener('mousedown', (event) => startDrawing(event));
                    canvas.removeEventListener('mouseup', (event) => stopDrawing(event));
                    canvas.removeEventListener('mousemove', (event) => userDraw(event));
                }

                var getCoord = (event) => {
                    offset_x = canvas.getBoundingClientRect().x;
                    offset_y = canvas.getBoundingClientRect().y;
                    return [event.clientX - offset_x, event.clientY - offset_y];
                };
                
                var startDrawing = (event) => {
                    drawPos = getCoord(event);
                    isDrawing = true;
                };
                
                var stopDrawing = (event) => {
                    isDrawing = false;
                    drawPos = [0,0];
                };
                
                var userDraw = (event) => {
                    // console.log('Mouse move event');
                    if (isDrawing) {
                        var pos = getCoord(event);
                        ctx.beginPath();
                        ctx.moveTo(drawPos[0], drawPos[1]);
                        ctx.lineTo(pos[0], pos[1]);
                        ctx.stroke();
                        drawPos = pos;
                    }
                };
            };
            
            ctrl.captureDrawing = () => {
                var imgData = ctrl.canvas.toDataURL("image/png");
                if (ctrl.lastCapturedImage === imgData) {
                    ctrl.isSendingImage = false;
                    return;
                }
                ctrl.lastCapturedImage = imgData;
                $http.post('/api/pictionary/updateDrawImage', {imageData: imgData, clearedCanvas: ctrl.clearedCanvas}, {headers: ctrl.getHeaders()})
                    .then((v) => {
                        ctrl.isSendingImage = false;
                        ctrl.clearedCanvas = false;
                    })
                    .catch((e) => console.log(e));
            };

            ctrl.clickColor = function (hex, a, b) {
                console.log(hex);
                document.getElementById('chosenColor').style.backgroundColor = hex;
                if (hex === "#FFFFFF") {
                    ctrl.ctx.strokeStyle = "#000000";
                } else {
                    ctrl.ctx.strokeStyle = hex;
                }
            };

            ctrl.mouseOverColor = function () {};
            ctrl.mouseOutMap = function () {};

            ctrl.setProgressBar = function (remaining) {
                var percent = remaining / 60;
                var currentColor = "";
                ctrl.pbRemaining.style.width = (percent * 100) + "%";
                ctrl.pbElapsed.style.width = ((1 - percent) * 100) + "%";
                ctrl.pbRemaining.innerText = remaining + "s";
                ctrl.pbRemaining.classList.forEach((v,k,p) => {
                    if (v.includes("bg")) {
                        currentColor = v;
                    }
                });
                ctrl.pbRemaining.classList.toggle(currentColor);
                if (remaining <= 10) {
                    ctrl.pbRemaining.classList.toggle("bg-danger");
                }
                else if (remaining <= 30) {
                    ctrl.pbRemaining.classList.toggle("bg-warning")
                }
                else {
                    ctrl.pbRemaining.classList.toggle("bg-success")
                }
            };

            ctrl.updateDrawTimer = function () {
                ctrl.drawTimerSeconds = 60 - parseInt((Date.now() - ctrl.tickData.roundStart) / 1000);
                if (ctrl.playerInfo.isDrawing && ctrl.drawTimerSeconds <= 0) {
                    console.log('Ending round.');
                    $http.post('api/pictionary/endRound',{},{headers: ctrl.getHeaders()})
                        // .then((v) => console.log(v))
                        .catch((e) => console.log(e));
                    return;
                }
                if (ctrl.drawTimerSeconds <= 0) {
                    ctrl.setProgressBar(0);
                    return;
                }
                ctrl.setProgressBar(ctrl.drawTimerSeconds);
            };

            ctrl.connectUser();
            ctrl.intervals.push(setInterval(ctrl.getGameState, 1000));
            ctrl.intervals.push(setInterval(ctrl.connectUser, 30*1000));
            $scope.$on('$destroy', function () {
                console.log("Exiting pictionary.");
                ctrl.intervals.forEach((id) => clearInterval(id));
                var headers = {
                    Authorization: 'Bearer ' + authentication.getToken()
                };
                $http.delete('/api/pictionary/disconnectUser', {headers: headers})
                    .then((v) => console.log(v))
                    .catch((e) => console.log(e));
            });

            // ctrl.getGameState();
            // ctrl.setupGame();
        }
    });