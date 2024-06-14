"use strict";
// import express, { Request, Response } from "express";
// import http from "http";
// import { Server, Socket } from "socket.io";
Object.defineProperty(exports, "__esModule", { value: true });
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// // Routes
// app.get("/", (req: Request, res: Response) => {
//     res.send("This is the MERN Realtime WhiteBoard sharing app");
// });
// let roomIdGlobal: string | undefined;
// let imgURLGlobal: string | undefined;
// io.on("connection", (socket: Socket) => {
//     socket.on("userJoined", (data: { name: string; userId: string; roomId: string; host: boolean; presenter: boolean }) => {
//         const {name,userId,roomId, host, presenter } = data;
//         roomIdGlobal = roomId;
//         socket.join(roomId);
//         socket.emit("userIsJoined", { success: true });
//         socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
//             imgURL: imgURLGlobal,
//         });
//     });
//     socket.on("whiteBoardDataResponse", (data: string) => {
//         imgURLGlobal = data;
//         if (roomIdGlobal) {
//             socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
//                 imgURL: data,
//             });
//         }
//     });
// });
// const port = process.env.PORT || 5000;
// server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var app = (0, express_1.default)();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server);
// const io= new Server(server,{
//     cors:{
//         origin:"*",
//         methods:["GET","POST"],
//     },
// })
// Routes
app.get("/", function (req, res) {
    res.send("This is the MERN Realtime WhiteBoard sharing app");
});
// Store image URLs for each room
var roomImages = new Map();
io.on("connection", function (socket) {
    socket.on("userJoined", function (data) {
        var name = data.name, userId = data.userId, roomId = data.roomId, host = data.host, presenter = data.presenter;
        socket.join(roomId);
        var users = addUser(data);
        socket.emit("userIsJoined", { success: true, users: users });
        socket.broadcast.to(roomId).emit("allUsers", users);
        // Send the latest whiteboard image to the newly joined user
        var imgURL = roomImages.get(roomId);
        socket.broadcast.to(roomId).emit("whiteBoardDataResponse", { imgURL: imgURL });
        socket.broadcast.to(roomId).emit("userJoined", { name: name, userId: userId, host: host, presenter: presenter });
    });
    socket.on("whiteBoardDataResponse", function (data) {
        var roomId = Array.from(socket.rooms).find(function (room) { return room !== socket.id; });
        if (roomId) {
            // Update the image URL for the specific room
            roomImages.set(roomId, data);
            // Broadcast the new image URL to all other users in the room
            socket.broadcast.to(roomId).emit("whiteBoardDataResponse", { imgURL: data });
        }
    });
});
var port = process.env.PORT || 5000;
server.listen(port, function () { return console.log("Server is running on http://localhost:".concat(port)); });
