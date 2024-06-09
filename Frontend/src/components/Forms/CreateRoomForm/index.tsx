import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface CreateRoomFormProps {
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

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ uuid , socket, setUser}) => {
  const [roomId, setRoomId] = useState<string>(uuid());
  const [name, setName] = useState<string>("");

  const navigate = useNavigate();

  const handleCreateRoom = (e: FormEvent) => {
    e.preventDefault();

    const roomData: RoomData = {
      name,
      roomId,
      userId: uuid(),
      host: true,
      presenter: true,
    };

    setUser(roomData);
    navigate(`/${roomId}`);
    console.log(roomData);
    socket.emit("userJoined", roomData); // Send the events using the emit method
  };

  return (
    <form className="form col-md-12 mt-5">
      <div className="form-group bg-grey">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <div className="input-group d-flex align-items-center justify-content-center">
          <input
            type="text"
            value={roomId}
            className="form-control my-2 border-0"
            disabled
            placeholder="Generate Room Code"
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary btn-sm mr-1"
              onClick={() => setRoomId(uuid())}
              type="button"
            >
              Generate
            </button>
            <button
              className="btn btn-outline-danger btn-sm mr-2"
              type="button"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
      <button
        className="mt-4 btn btn-primary btn-block form-control"
        type="submit"
        onClick={handleCreateRoom}
      >
        Generate Room
      </button>
    </form>
  );
};

export default CreateRoomForm;
