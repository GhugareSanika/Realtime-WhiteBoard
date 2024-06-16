// import express, { Request, Response } from "express";
// import http from "http";
// import { Server, Socket } from "socket.io";

// const {addUser, getUser } = require("./utils/users")
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // Store image URLs for each room
// const roomImages: Map<string, string | undefined> = new Map();
// // Store users for each room
// const roomUsers: Map<string, { name: string; userId: string; host: boolean; presenter: boolean }[]> = new Map();

// function addUser(data: { name: string; userId: string; roomId: string; host: boolean; presenter: boolean, socketId: string }) {
//     const { name, userId, roomId, host, presenter, socketId } = data;
//     let users = roomUsers.get(roomId) || [];
//     users.push({ name, userId, host, presenter });
//     roomUsers.set(roomId, users);
//     return users;
// }

// // Routes
// app.get("/", (req: Request, res: Response) => {
//     res.send("This is the MERN Realtime WhiteBoard sharing app");
// });

// io.on("connection", (socket: Socket) => {
//     socket.on("userJoined", (data: { name: string; userId: string; roomId: string; host: boolean; presenter: boolean}) => {
//         const { name, userId, roomId, host, presenter } = data;
//         socket.join(roomId);
//         const users = addUser({ name, userId, roomId, host, presenter, socketId: socket.id});
        
//         //console.log(users);
//         socket.emit("userIsJoined", { success: true, users });
//         socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", name)
//         socket.broadcast.to(roomId).emit("allUsers", users);

//         // Send the latest whiteboard image to the newly joined user
//         const imgURL = roomImages.get(roomId);
//         socket.broadcast.to(roomId).emit("whiteBoardDataResponse", { imgURL });

//         socket.broadcast.to(roomId).emit("userJoined", { name, userId, host, presenter });
//     });


//     socket.on("whiteBoardData", (data: string) => {
//         const roomId = Array.from(socket.rooms).find(room => room !== socket.id);
//         if (roomId) {
//             // Update the image URL for the specific room
//             roomImages.set(roomId, data);
//             // Broadcast the new image URL to all other users in the room
//             socket.broadcast.to(roomId).emit("whiteBoardDataResponse", { imgURL: data });
//         }
//     });
//     //console.log(socket.id);

//     socket.on("disconnect",() =>{
//         const user = getUser(socket.id)
//         const removedUser =removeUser(socket.id);
//         if(user) {
//             console.log(user);
//             socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBrodcasted",user.name)
//         }
//     })
// });

// const port = process.env.PORT || 5000;

// server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));



import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const { addUser, getUser, removeUser } = require("./utils/users");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

interface User {
    name: string;
    userId: string;
    host: boolean;
    presenter: boolean;
}

interface AddUserParams extends User {
    roomId: string;
    socketId: string;
}

// Store image URLs for each room
const roomImages: Map<string, string | undefined> = new Map();
// Store users for each room
const roomUsers: Map<string, { name: string; userId: string; host: boolean; presenter: boolean } []> = new Map();

function addUserToRoom(data: { name: string; userId: string; roomId: string; host: boolean; presenter: boolean, socketId: string }) {
    const { name, userId, roomId, host, presenter, socketId } = data;
    let users = roomUsers.get(roomId) || [];
    users.push({ name, userId, host, presenter });
    roomUsers.set(roomId, users);
    return users;
}

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("This is the MERN Realtime WhiteBoard sharing app");
});

io.on("connection", (socket: Socket) => {
    socket.on("userJoined", (data: { name: string; userId: string; roomId: string; host: boolean; presenter: boolean }) => {
        const { name, userId, roomId, host, presenter } = data;
        socket.join(roomId);
        const users = addUser({ name, userId, roomId, host, presenter, socketId: socket.id });
        
        socket.emit("userIsJoined", { success: true, users });
        socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", name);
        socket.broadcast.to(roomId).emit("allUsers", users);

        // Send the latest whiteboard image to the newly joined user
        const imgURL = roomImages.get(roomId);
        //socket.emit("whiteBoardDataResponse", { imgURL });
        socket.broadcast.to(roomId).emit("whiteBoardDataResponse", { imgURL });
        
        socket.broadcast.to(roomId).emit("userJoined", { name, userId, host, presenter });
    });

    socket.on("whiteBoardDataResponse", (data: string) => {
        const roomId = Array.from(socket.rooms).find(room => room !== socket.id);
        if (roomId) {
            // Update the image URL for the specific room
            roomImages.set(roomId, data);
            // Broadcast the new image URL to all other users in the room
            socket.broadcast.to(roomId).emit("whiteBoardDataResponse", { imgURL: data });
        }
    });

    socket.on("disconnect", () => {
        const user = getUser(socket.id);
        const removedUser = removeUser(socket.id);
        if (user) {
            console.log(user);
            socket.broadcast.to(user.roomId).emit("userLeftMessageBroadcasted", user.name);
        }
    });
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
