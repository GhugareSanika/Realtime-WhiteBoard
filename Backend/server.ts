import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("This is the MERN Realtime WhiteBoard sharing app");
});

let roomIdGlobal, imgURLGlobal;

io.on("connection", (socket: Socket) => {
    socket.on("userJoined", (data) =>{
        const { name, userId, roomId, host, presenter } = data;
        roomIdGlobal = roomId;
        socket.join(roomId);
        socket.emit("userIsJoined",{ success: true});
        socket.broadcast.to(roomId).emit("whiteBoardDataResponse",{
            imgURL : imgURLGlobal,
        })
    })

    socket.on("whiteBoardDataResponse",(data)=>{
        imgURLGlobal = data;
        socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse",{
        imgURL : data,
        })
    })
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
