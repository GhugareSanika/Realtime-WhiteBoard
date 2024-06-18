"use strict";
// interface User {
//     name: string;
//     userId: string;
//     roomId: string;
//     host: boolean;
//     presenter: boolean;
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
var users = [];
// Add user to the list
var addUser = function (_a) {
    var name = _a.name, userId = _a.userId, roomId = _a.roomId, host = _a.host, presenter = _a.presenter, socketId = _a.socketId;
    var user = { name: name, userId: userId, roomId: roomId, host: host, presenter: presenter, socketId: socketId };
    users.push(user);
    return users.filter(function (user) { return user.roomId === roomId; });
};
exports.addUser = addUser;
// Remove the user from the list
var removeUser = function (id) {
    var index = users.findIndex(function (user) { return user.socketId === id; });
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return undefined;
};
exports.removeUser = removeUser;
// Get a user from the list
var getUser = function (id) {
    return users.find(function (user) { return user.socketId === id; });
};
exports.getUser = getUser;
// Get all users from the room
var getUsersInRoom = function (roomId) {
    return users.filter(function (user) { return user.roomId === roomId; });
};
exports.getUsersInRoom = getUsersInRoom;
