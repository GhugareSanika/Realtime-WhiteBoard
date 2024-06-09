import React, { useRef, useState } from 'react';
import './index.css';
import WhiteBoard from '../../components/Whiteboard';

interface User {
    presenter: boolean;
    [key: string]: any; // Add additional properties as needed
}

interface RoomPageProps {
    user: User; // Include user in the interface
    socket: any; // Add socket to the interface
}

const RoomPage: React.FC<RoomPageProps> = ({ user, socket }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);

    const [tool, setTool] = useState<string>("pencil");
    const [color, setColor] = useState<string>("black");
    const [elements, setElements] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);

    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx && canvas) {
            ctx.fillStyle = "white";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setElements([]);
        }
    };

    const undo = () => {
        setHistory((prevHistory) => [
            ...prevHistory,
            elements[elements.length - 1],
        ]);
        setElements((prevElements) =>
            prevElements.slice(0, prevElements.length - 1)
        );
    };

    const redo = () => {
        setElements((prevElements) => [
            ...prevElements,
            history[history.length - 1],
        ]);
        setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="row">
            <h1 className="text-center py-3">White Board Sharing App{" "}
                <span className="text-primary">[Users Online : 0]</span>
            </h1>
            {user.presenter && (
                <div className="col-md-10 mx-auto px-5 mb-3 d-flex align-items-center justify-content-center">
                <div className="d-flex col-md-2 justify-content-center gap-1">
                    <div className="d-flex gap-1 align-items-center">
                        <label htmlFor="pencil">Pencil</label>
                        <input
                            type="radio"
                            name="tool"
                            id="pencil"
                            checked={tool === "pencil"}
                            value="pencil"
                            className="mt-1"
                            onChange={(e) => setTool(e.target.value)}
                        />
                    </div>
                    <div className="d-flex gap-1 align-items-center justify-content-center">
                        <label htmlFor="line">Line</label>
                        <input
                            type="radio"
                            name="tool"
                            id="line"
                            checked={tool === "line"}
                            value="line"
                            className="mt-1"
                            onChange={(e) => setTool(e.target.value)}
                        />
                    </div>
                    <div className="d-flex gap-1 align-items-center">
                        <label htmlFor="rect">Rectangle</label>
                        <input
                            type="radio"
                            name="tool"
                            id="rect"
                            checked={tool === "rect"}
                            value="rect"
                            className="mt-1"
                            onChange={(e) => setTool(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3 mx-auto">
                    <div className="d-flex align-items-center justify-content-center">
                        <label htmlFor="color">Select Color:</label>
                        <input
                            type="color"
                            id="color"
                            value={color}
                            className="mt-1 ms-3"
                            onChange={(e) => setColor(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3 d-flex gap-2">
                    <button 
                      className="btn btn-primary mt-1" 
                      disabled={elements.length === 0}
                      onClick={() => undo()}>Undo</button>
                    <button 
                      className="btn btn-outline-primary mt-1" 
                      disabled={history.length < 1}
                      onClick={() => redo()}>Redo</button>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-danger" onClick={handleClearCanvas}>Clear Canvas</button>
                </div>
            </div>
            )}
            
            <div className="col-md-10 mx-auto mt-2 canvas-box">
                <WhiteBoard
                    canvasRef={canvasRef}
                    ctx={ctx}
                    elements={elements}
                    setElements={setElements} 
                    color={color}
                    tool={tool}
                    user={user}
                    socket={socket} // Pass the socket prop to WhiteBoard
                />
            </div>
        </div>
    );
}

export default RoomPage;
