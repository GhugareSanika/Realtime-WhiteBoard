// App.tsx
import React, { useEffect, useState } from 'react';
import './App.css';
import Forms from './components/Forms';
import { Route, Routes, Navigate } from 'react-router-dom';
import RoomPage from './pages/RoomPage';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';

interface RoomData {
  name: string;
  roomId: string;
  userId: string;
  host: boolean;
  presenter: boolean;
}

const server = "http://localhost:5000";
//const server = "https://realtime-whiteboard-1-d3ap.onrender.com";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App: React.FC = () => {
  const [user, setUser] = useState<RoomData | null>(null);
  const [users,setUsers] = useState([]);

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("userJoined");
        setUsers(data.users);
      } else {
        console.log("userJoined error");
      }
    });

    socket.on("allUsers",(data) =>{
      setUsers(data);
    })

    socket.on ("userJoinedMessageBroadcasted",(data) =>{
      console.log(`${data} joined the room`);
      toast.info(`${data} joined the room`);
    })

    // socket.on ("userJoinedMessageBroadcasted",(data) =>{
    //   console.log(`${data} left the room`);
    //   toast.info(`${data} left the room`);
    // })
  }, []);



  const uuid = () => {
    let S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  };

  return (
    <div className="container">
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />} />
        <Route
          path="/:roomId"
          element={user ? <RoomPage user={user} socket={socket} users={users}/> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};

export default App;
