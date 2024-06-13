// import express, { Request, Response } from "express";
// import http from "http";
// import { Server, Socket } from "socket.io";

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


import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// const io= new Server(server,{
//     cors:{
//         origin:"*",
//         methods:["GET","POST"],
//     },
// })

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("This is the MERN Realtime WhiteBoard sharing app");
});

// Store image URLs for each room
const roomImages: Map<string, string | undefined> = new Map();

io.on("connection", (socket: Socket) => {
    socket.on("userJoined", (data: { name: string; userId: string; roomId: string; host: boolean; presenter: boolean }) => {
        const { name, userId, roomId, host, presenter } = data;
        socket.join(roomId);
        socket.emit("userIsJoined", { success: true });

        // Send the latest whiteboard image to the newly joined user
        const imgURL = roomImages.get(roomId);
        socket.emit("whiteBoardDataResponse", { imgURL });

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
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
