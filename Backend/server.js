"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var users_1 = require("./utils/users");
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server);
// Store image URLs for each room
var roomImages = new Map();
// Store users for each room
var roomUsers = new Map();
function addUserToRoom(data) {
    var name = data.name, userId = data.userId, roomId = data.roomId, host = data.host, presenter = data.presenter, socketId = data.socketId;
    var users = roomUsers.get(roomId) || [];
    users.push({ name: name, userId: userId, roomId: roomId, host: host, presenter: presenter, socketId: socketId });
    roomUsers.set(roomId, users);
    return users;
}
// Routes
app.get('/', function (req, res) {
    res.send('This is the MERN Realtime WhiteBoard sharing app');
});
io.on('connection', function (socket) {
    socket.on('userJoined', function (data) {
        var name = data.name, userId = data.userId, roomId = data.roomId, host = data.host, presenter = data.presenter, socketId = data.socketId;
        socket.join(roomId);
        var users = (0, users_1.addUser)({ name: name, userId: userId, roomId: roomId, host: host, presenter: presenter, socketId: socket.id });
        socket.emit('userIsJoined', { success: true, users: users });
        socket.broadcast.to(roomId).emit('userJoinedMessageBroadcasted', name);
        socket.broadcast.to(roomId).emit('allUsers', users);
        // Send the latest whiteboard image to the newly joined user
        var imgURL = roomImages.get(roomId);
        socket.emit('whiteBoardDataResponse', { imgURL: imgURL });
        socket.broadcast.to(roomId).emit('userJoined', { name: name, userId: userId, host: host, presenter: presenter });
    });
    socket.on('whiteBoardDataResponse', function (data) {
        var roomId = Array.from(socket.rooms).find(function (room) { return room !== socket.id; });
        if (roomId) {
            // Update the image URL for the specific room
            roomImages.set(roomId, data);
            // Broadcast the new image URL to all other users in the room
            socket.broadcast.to(roomId).emit('whiteBoardDataResponse', { imgURL: data });
        }
    });
    socket.on('message', function (data) {
        var message = data.message;
        var user = (0, users_1.getUser)(socket.id);
        if (user) {
            socket.broadcast.to(user.roomId).emit('messageResponse', { message: message, name: user.name });
        }
    });
    socket.on('disconnect', function () {
        var user = (0, users_1.getUser)(socket.id);
        if (user) {
            (0, users_1.removeUser)(socket.id);
            socket.broadcast.to(user.roomId).emit('userLeftMessageBroadcasted', user.name);
        }
    });
});
var port = process.env.PORT || 5000;
server.listen(port, function () { return console.log("Server is running on http://localhost:".concat(port)); });
