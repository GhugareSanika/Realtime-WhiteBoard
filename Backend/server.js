"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server);
// Routes
app.get("/", function (req, res) {
    res.send("This is the MERN Realtime WhiteBoard sharing app");
});
var roomIdGlobal, imgURLGlobal;
io.on("connection", function (socket) {
    socket.on("userJoined", function (data) {
        var name = data.name, userId = data.userId, roomId = data.roomId, host = data.host, presenter = data.presenter;
        roomIdGlobal = roomId;
        socket.join(roomId);
        socket.emit("userIsJoined", { success: true });
        socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
            imgURL: imgURLGlobal,
        });
    });
    socket.on("whiteBoardDataResponse", function (data) {
        imgURLGlobal = data;
        socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
            imgURL: data,
        });
    });
});
var port = process.env.PORT || 5000;
server.listen(port, function () { return console.log("Server is running on http://localhost:".concat(port)); });
