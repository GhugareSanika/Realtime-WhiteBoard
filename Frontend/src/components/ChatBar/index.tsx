import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';

interface ChatProps {
  setOpenedChatTab: (isOpen: boolean) => void;
  socket: any;
}

interface ChatMessage {
  message: string;
  name: string;
}

const Chat: React.FC<ChatProps> = ({ setOpenedChatTab, socket }) => {
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const handleMessageResponse = (data: ChatMessage) => {
      setChat((prevChats) => [...prevChats, data]);
    };

    socket.on("messageResponse", handleMessageResponse);

    // Cleanup the event listener on component unmount
    return () => {
      socket.off("messageResponse", handleMessageResponse);
    };
  }, [socket]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() !== "") {
      socket.emit("message", {message});
      setChat((prevChats) => [...prevChats, { message, name: "You" }]);
      setMessage(""); // Clear the input after sending the message
    }
  };

  return (
    <div 
      className="position-fixed z-1 top-0 h-100 text-white bg-dark"
      style={{ width: "250px", left: "0%" }}
    >
      <button 
        type="button" 
        onClick={() => setOpenedChatTab(false)}
        className="btn btn-light btn-block w-100 mt-5"
      >
        Close
      </button>
      
      <div
        className="w-100 mt-5 p-2 border border-1 border-white rounded-3"
        style={{
          height: "70%",
          backgroundImage: "url('src/images/chat.webp')",
          backgroundSize: "cover", // Adjust to fit the image to the container
          backgroundPosition: "center", // Center the image
        }}
      >
        {chat.map((chatMessage, index) => (
          <p key={index} className="my-2 text-center w-100 py-1 border border-left-0 border-right-0">
            {chatMessage.name}: {chatMessage.message}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="w-100 mt-4 d-flex rounded-3 align-items-center" style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Enter message"
          className="h-100 border-0 rounded-0 py-2 px-4.1"
          style={{
            width: "100%",
            paddingLeft: "30px" // Add padding to make space for the image
          }}
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
        />
        <img 
          src="src/images/msg.png" // Path relative to the public directory
          alt="icon" 
          style={{
            position: 'absolute',
            left: '2px',
            height: '24px',
            width: '23px'
          }}
        />
        <button type="submit" className="btn btn-secondary rounded-0">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
