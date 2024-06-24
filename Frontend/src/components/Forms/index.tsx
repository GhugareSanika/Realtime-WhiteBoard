import React from 'react';
import "./index.css"
import CreateRoomForm from './CreateRoomForm';
import JoinRoomForm from './JoinRoomForm';
import { Socket } from 'socket.io-client';

// Define the type for the props of the Forms component
interface FormsProps {
  uuid: () => string;
  socket: Socket;
  setUser: (user: RoomData) => void;
}

// Define the type for the RoomData interface
interface RoomData {
  name: string;
  roomId: string;
  userId: string;
  host: boolean;
  presenter: boolean;
}

// Define the Forms component with TypeScript
const Forms: React.FC<FormsProps> = ({ uuid, socket, setUser }) => {
  return (
    <div className="background-container">
      <div className="content-container">
        <div className="row h-100 pt-5">
          <div className="col-md-4 mt-5 form-box p-5 border border-0 border-black rounded-4 mx-auto d-flex flex-column align-items-center">
            <h1 className="text-black fn-bold">Create Room</h1>
            <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser} />
          </div>
          <div className="col-md-4 mt-5 form-box p-5 border border-0 border-black rounded-4 mx-auto d-flex flex-column align-items-center">
            <h1 className="text-black fn-bold">Join Room</h1>
            <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forms;
