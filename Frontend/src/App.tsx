import React, { useEffect, useState } from 'react';
import './App.css';
import Forms from './components/Forms';
import { Route, Routes, Navigate } from 'react-router-dom';
import RoomPage from './pages/RoomPage';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import './components/Whiteboard/index.css'; 
import './components/Forms/index.css'; 
import './pages/RoomPage/index.css';

interface RoomData {
  name: string;
  roomId: string;
  userId: string;
  host: boolean;
  presenter: boolean;
}

const server = "http://localhost:5000";
//const server = "https://realtime-whiteboard-1-d3ap.onrender.com";
//https://realtime-whiteboard-1-d3ap.onrender.com
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App: React.FC = () => {
  const [user, setUser] = useState<RoomData | null>(null);
  const [users, setUsers] = useState<any[]>([]); // Assuming users is an array of any type

  useEffect(() => {
    const handleUserIsJoined = (data: any) => {
      if (data.success) {
        console.log("userJoined");
        setUsers(data.users);
      } else {
        console.log("userJoined error");
      }
    };

    const handleAllUsers = (data: any) => {
      setUsers(data);
    };

    const handleUserJoinedMessageBroadcasted = (data: any) => {
      console.log(`${data} joined the room`);
      toast.info(`${data} joined the room`);
    };

    const handleUserLeftMessageBroadcasted = (data: any) => {
      console.log(`${data} left the room`);
      toast.info(`${data} left the room`);
    };

    // Add listeners on component mount
    socket.on("userIsJoined", handleUserIsJoined);
    socket.on("allUsers", handleAllUsers);
    socket.on("userJoinedMessageBroadcasted", handleUserJoinedMessageBroadcasted);
    socket.on("userLeftMessageBroadcasted", handleUserLeftMessageBroadcasted);

    // Clean up listeners on component unmount or when dependencies change
    return () => {
      socket.off("userIsJoined", handleUserIsJoined);
      socket.off("allUsers", handleAllUsers);
      socket.off("userJoinedMessageBroadcasted", handleUserJoinedMessageBroadcasted);
      socket.off("userLeftMessageBroadcasted", handleUserLeftMessageBroadcasted);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

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
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />} />
        <Route
          path="/:roomId"
          element={user ? <RoomPage user={user} socket={socket} users={users} /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};

export default App;
