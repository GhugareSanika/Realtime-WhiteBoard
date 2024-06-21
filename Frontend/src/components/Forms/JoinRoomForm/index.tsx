import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface JoinRoomFormProps {
  uuid: () => string;
  socket: Socket;
  setUser: (user: RoomData) => void;
}

interface RoomData {
  name: string;
  roomId: string;
  userId: string;
  host: boolean;
  presenter: boolean;
}

const JoinRoomForm: React.FC<JoinRoomFormProps> = ({ uuid, socket, setUser }) => {
  const [roomId, setRoomId] = useState<string>("");
  const [name, setName] = useState<string>("");

  const navigate = useNavigate();

  const handleRoomJoin = (e: FormEvent) => {
    e.preventDefault();

    const roomData: RoomData = {
      name,
      roomId,
      userId: uuid(),
      host: false,
      presenter: false,
    };

    setUser(roomData);
    navigate(`/${roomId}`);
    socket.emit("userJoined", roomData);
  };

  return (
    <form className="form col-md-12 mt-5" onSubmit={handleRoomJoin}>
      <div className="form-group bg-grey">
        <input
          type="text"
          className="form-control my-3 border border-2 border-black"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control my-2 border border-2 border-black"
          placeholder="Enter Room Code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      <button type="submit" className="mt-4 btn btn-primary btn-block form-control"  style={{ backgroundColor: "#06b6d4", color: "white", border: "none" }}>
        Join Room
      </button>
    </form>
  );
}

export default JoinRoomForm;
