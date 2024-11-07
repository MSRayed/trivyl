"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomManager = void 0;
var node_http_1 = require("node:http");
var next_1 = require("next");
var socket_io_1 = require("socket.io");
var RoomManager_1 = require("@/managers/RoomManager");
var utils_1 = require("@/lib/utils");
var dev = process.env.NODE_ENV !== "production";
var hostname = "localhost";
var port = Number(process.env.PORT) || 4000;
// when using middleware `hostname` and `port` must be provided below
var app = (0, next_1.default)({ dev: dev, hostname: hostname, port: port });
var handler = app.getRequestHandler();
var answerShowTime = 5;
var maxScorePerTurn = 20;
exports.roomManager = new RoomManager_1.default();
app.prepare().then(function () {
    var httpServer = (0, node_http_1.createServer)(handler);
    var io = new socket_io_1.Server(httpServer, {
        connectionStateRecovery: {
            // the backup duration of the sessions and the packets
            maxDisconnectionDuration: 2 * 60 * 1000,
            // whether to skip middlewares upon successful recovery
            skipMiddlewares: true,
        },
    });
    io.on("connection", function (socket) {
        socket.on("join", function (name, code, callback) {
            if (!exports.roomManager.roomExists(code)) {
                exports.roomManager.addRoom(code);
                console.log("New room created ".concat(code));
            }
            var room = exports.roomManager.getRoom(code);
            if (room.playerExists(socket.id)) {
                console.log("Already connected ".concat(name));
                return;
            }
            var player = room.admit(name, socket.id);
            console.log("Admitted ".concat(name));
            callback({
                status: "ok",
                isOwner: player.owner,
                players: room.getAllPlayers(),
            });
            socket.to(code).emit("new-player", player);
            socket.join(code);
            io.in(code).emit("message", {
                text: "".concat(player.name, " joined the room"),
                type: "join",
            });
        });
        socket.on("disconnect", function (_) {
            var room = exports.roomManager.getRoomOfPlayer(socket.id);
            if (!room) {
                console.log("Couldn't find room of player");
                return;
            }
            var player = room.removePlayer(socket.id);
            socket
                .to(room === null || room === void 0 ? void 0 : room.code)
                .emit("player-disconnected", player, room.getOwner().id);
            io.in(room.code).emit("message", {
                text: "".concat(player.name, " left the room"),
                type: "leave",
            });
            console.log("".concat(player.name, " disconnected"));
            // Delete room if empty
            if (room.isEmpty()) {
                exports.roomManager.deleteRoom(room.code);
                console.log("Deleted room ".concat(room.code));
            }
        });
        socket.on("guess", function (guess, callback) {
            var room = exports.roomManager.getRoomOfPlayer(socket.id);
            if (!room) {
                console.log("Couldn't find room");
                return;
            }
            var currQuestion = room === null || room === void 0 ? void 0 : room.getCurrentQuestion();
            if (!currQuestion) {
                console.log("Couldn't find question");
                return;
            }
            var player = room.getPlayer(socket.id);
            console.log("".concat(player.name, " made a guess"));
            if ((0, utils_1.wordMatchPercentage)(guess, currQuestion.answer, 50) &&
                !player.guessed) {
                // Calculate score
                var score = Math.ceil(((room.timer - answerShowTime) / room.answerTime) * maxScorePerTurn);
                player.addScore(score);
                player.setGuessed();
                callback({
                    correct: true,
                });
                io.in(room.code).emit("update-score", {
                    id: player.id,
                    newScore: player.score,
                });
                io.in(room.code).emit("message", {
                    text: "".concat(player.name, " got the answer"),
                    type: "guess",
                });
            }
            else {
                callback({
                    correct: false,
                });
            }
        });
        socket.on("start-game", function () {
            var room = exports.roomManager.getRoomOfPlayer(socket.id);
            if (!room) {
                console.log("Couldn't find room");
                return;
            }
            var player = room === null || room === void 0 ? void 0 : room.getPlayer(socket.id);
            if (!player.owner) {
                console.log("Player cannot start the game");
                return;
            }
            var startGame = function () {
                var question = room === null || room === void 0 ? void 0 : room.getQuestion();
                // console.log(question.answer);
                if (!question) {
                    console.log("Quiz ended");
                    var ranking = room.getRanking();
                    io.in(room === null || room === void 0 ? void 0 : room.code).emit("results", ranking);
                    return;
                }
                io.in(room === null || room === void 0 ? void 0 : room.code).emit("new-question", {
                    query: question.query,
                    id: question.id,
                });
                room.setTimer(room.answerTime + answerShowTime);
                room.ready();
                var intervalId = setInterval(function () {
                    room.decTimer();
                    io.in(room === null || room === void 0 ? void 0 : room.code).emit("tick", room.timer - answerShowTime);
                    // If everyone in the room guessed the right show the answer and stop the timer
                    if (room.timer == answerShowTime || room.allGuessed()) {
                        io.in(room === null || room === void 0 ? void 0 : room.code).emit("answer", question.answer);
                        // In case of finishing early
                        room.ready();
                        room.setTimer(answerShowTime - 1);
                    }
                    // Reset the timer
                    if (room.timer == 0) {
                        room.setTimer(room.answerTime + answerShowTime);
                        clearInterval(intervalId);
                        startGame();
                    }
                }, 1000);
            };
            if (room) {
                room.initQuestions();
                startGame();
                console.log("Room ".concat(room === null || room === void 0 ? void 0 : room.code, " game started"));
            }
        });
    });
    httpServer
        .once("error", function (err) {
        console.error(err);
        process.exit(1);
    })
        .listen(port, function () {
        console.log("> Ready on http://".concat(hostname, ":").concat(port));
    });
});
