import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { addUser, getUser, removeUser } from './utils/users';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

interface User {
    name: string;
    userId: string;
    host: boolean;
    presenter: boolean;
    roomId: string;
    socketId: string;
}

// Store image URLs for each room
const roomImages: Map<string, string | undefined> = new Map();
// Store users for each room
const roomUsers: Map<string, User[]> = new Map();

function addUserToRoom(data: User) {
    const { name, userId, roomId, host, presenter, socketId } = data;
    let users = roomUsers.get(roomId) || [];
    users.push({ name, userId, roomId, host, presenter, socketId });
    roomUsers.set(roomId, users);
    return users;
}

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('This is the MERN Realtime WhiteBoard sharing app');
});

io.on('connection', (socket: Socket) => {
    socket.on('userJoined', (data: User) => {
        const { name, userId, roomId, host, presenter, socketId } = data;
        socket.join(roomId);
        const users = addUser({ name, userId, roomId, host, presenter, socketId: socket.id });
        
        socket.emit('userIsJoined', { success: true, users });
        socket.broadcast.to(roomId).emit('userJoinedMessageBroadcasted', name);
        socket.broadcast.to(roomId).emit('allUsers', users);

        // Send the latest whiteboard image to the newly joined user
        const imgURL = roomImages.get(roomId);
        socket.emit('whiteBoardDataResponse', { imgURL });
        
        socket.broadcast.to(roomId).emit('userJoined', { name, userId, host, presenter });
    });

    socket.on('whiteBoardDataResponse', (data: string) => {
        const roomId = Array.from(socket.rooms).find(room => room !== socket.id);
        if (roomId) {
            // Update the image URL for the specific room
            roomImages.set(roomId, data);
            // Broadcast the new image URL to all other users in the room
            socket.broadcast.to(roomId).emit('whiteBoardDataResponse', { imgURL: data });
        }
    });

    socket.on('message', (data: { message: string }) => {
        const { message } = data;
        const user = getUser(socket.id);
        if (user) {
            socket.broadcast.to(user.roomId).emit('messageResponse', { message, name: user.name });
        }
    });

    socket.on('disconnect', () => { 
        const user = getUser(socket.id);
        if (user) {
            removeUser(socket.id);
            socket.broadcast.to(user.roomId).emit('userLeftMessageBroadcasted', user.name);
        }
    });
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
