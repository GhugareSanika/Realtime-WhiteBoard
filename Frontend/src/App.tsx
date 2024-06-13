// App.tsx
import React, { useEffect, useState } from 'react';
import './App.css';
import Forms from './components/Forms';
import { Route, Routes, Navigate } from 'react-router-dom';
import RoomPage from './pages/RoomPage';
import io from 'socket.io-client';

interface RoomData {
  name: string;
  roomId: string;
  userId: string;
  host: boolean;
  presenter: boolean;
}

const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App: React.FC = () => {
  const [user, setUser] = useState<RoomData | null>(null);

  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("userJoined");
      } else {
        console.log("userJoined error");
      }
    });
    // Cleanup socket connection on unmount
    // return () => {
    //   socket.off("userIsJoined");
    // };
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
      <Routes>
        <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser} />} />
        <Route
          path="/:roomId"
          element={user ? <RoomPage user={user} socket={socket} /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
};

export default App;
