# Realtime Whiteboard Sharing App

This is a Realtime Whiteboard Sharing App built with TypeScript, React.js, and Socket.io for collaborative drawing. Users can create and join rooms to draw together on a shared canvas in real-time.

## Features

- **Create Room**: Allows a user to create a new room.
- **Join Room**: Users can join existing rooms using a unique room ID.
- **Drawing Tools**:
  - **Pencil**: Freehand drawing tool.
  - **Rectangle**: Draw rectangular shapes.
  - **Line**: Draw straight lines.
- **Canvas Controls**:
  - **Undo/Redo**: Undo or redo the last action.
  - **Change Color**: Select different colors for drawing.
  - **Clear Canvas**: Clear all drawings from the canvas.
- **Real-Time Collaboration**: 
  - **Live Updates**: Users can see the host's canvas live.
  - **User List**: Displays the list of users in the room and current online users.

## Technologies Used

- **Frontend**: TypeScript, React.js
- **Backend**: Node.js, Express.js
- **WebSockets**: Socket.io
- **Package Manager**: Yarn

## Installation

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/yourusername/realtime-whiteboard-sharing-app.git
   cd realtime-whiteboard-sharing-app
