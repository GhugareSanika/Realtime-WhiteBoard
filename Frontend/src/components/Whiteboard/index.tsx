
// import React, { useEffect, useLayoutEffect, useState, RefObject } from "react";
// import rough from "roughjs";

// interface Element {
//   offsetX: number;
//   offsetY: number;
//   width?: number;
//   height?: number;
//   path?: [number, number][];
//   stroke: string;
//   element: "rect" | "line" | "pencil";
// }

// interface User {
//   presenter: boolean;
//   [key: string]: any; // Add additional properties as needed
// }

// interface CanvasProps {
//   canvasRef: RefObject<HTMLCanvasElement>;
//   ctx: React.MutableRefObject<CanvasRenderingContext2D | null>; // Use MutableRefObject here
//   color: string;
//   setElements: React.Dispatch<React.SetStateAction<Element[]>>;
//   elements: Element[];
//   tool: string;
//   user: User;
//   socket: any; // You might want to provide a specific type for socket
// }

// const generator = rough.generator();

// const Canvas: React.FC<CanvasProps> = ({ 
//   canvasRef, 
//   ctx, 
//   color, 
//   setElements, 
//   elements, 
//   tool, 
//   socket,
//   user 
// }) => {
//   const [img, setImg] = useState<string | undefined>("");

//   useEffect(() => {
//     socket.on("whiteBoardDataResponse", (data: { imgURL: string }) => {
//       setImg(data.imgURL);
//     });
//   }, [socket]);

//   if (!user?.presenter) {
//     return (
//       <div className="border border-dark border-3 h-100 w-100 overflow-hidden">
//         <img 
//           src={img}
//           alt="Real-time whiteboard image shared by presenter"
//           style={{
//             height: window.innerHeight * 2,
//             width: "255%",
//           }}
//         />
//       </div>
//     );
//   }

//   const [isDrawing, setIsDrawing] = useState(false);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       canvas.height = window.innerHeight * 2;
//       canvas.width = window.innerWidth * 2;
//       const context = canvas.getContext("2d");

//       if (context) {
//         context.lineWidth = 2;
//         context.lineCap = "round";
//         context.strokeStyle = color;
//         ctx.current = context; // Set the context in the mutable ref
//       }
//     }
//   }, [canvasRef, color, ctx]);

//   useEffect(() => {
//     if (ctx.current) {
//       ctx.current.strokeStyle = color;
//     }
//   }, [color, ctx]);

//   useLayoutEffect(() => {
//     const canvasElement = canvasRef.current;
//     if (!canvasElement) return; // Check if canvasRef.current is null
//     const roughCanvas = rough.canvas(canvasElement);

//     if (ctx.current) {
//       ctx.current.clearRect(0, 0, canvasElement.width, canvasElement.height);
//     }

//     elements.forEach((ele) => {
//       if (ele.element === "rect") {
//         roughCanvas.draw(
//           generator.rectangle(ele.offsetX, ele.offsetY, ele.width || 0, ele.height || 0, {
//             stroke: ele.stroke,
//             roughness: 0,
//             strokeWidth: 5,
//           })
//         );
//       } else if (ele.element === "line") {
//         roughCanvas.draw(
//           generator.line(ele.offsetX, ele.offsetY, ele.offsetX + (ele.width || 0), ele.offsetY + (ele.height || 0), {
//             stroke: ele.stroke,
//             roughness: 0,
//             strokeWidth: 5,
//           })
//         );
//       } else if (ele.element === "pencil") {
//         roughCanvas.linearPath(ele.path || [], {
//           stroke: ele.stroke,
//           roughness: 0,
//           strokeWidth: 5,
//         });
//       }
//     });

//     const canvasImage = canvasRef.current?.toDataURL();
//     if (canvasImage && socket) {
//       socket.emit("whiteBoardDataResponse", canvasImage);
//     } else {
//       console.error("Socket is undefined or canvas image is null");
//     }
//   }, [elements, canvasRef, socket, ctx]);

//   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     const { offsetX, offsetY } = e.nativeEvent;

//     if (tool === "pencil") {
//       setElements((prevElements) => [
//         ...prevElements,
//         {
//           offsetX,
//           offsetY,
//           path: [[offsetX, offsetY]],
//           stroke: color,
//           element: tool,
//         },
//       ]);
//     } else if (tool === "line") {
//       setElements((prevElements) => [
//         ...prevElements,
//         {
//           offsetX,
//           offsetY,
//           width: 0,
//           height: 0,
//           stroke: color,
//           element: tool,
//         },
//       ]);
//     } else if (tool === "rect") {
//       setElements((prevElements) => [
//         ...prevElements,
//         {
//           offsetX,
//           offsetY,
//           width: 0,
//           height: 0,
//           stroke: color,
//           element: tool,
//         },
//       ]);
//     }

//     setIsDrawing(true);
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
//     const { offsetX, offsetY } = e.nativeEvent;
//     if (isDrawing) {
//       if (tool === "pencil") {
//         const path = elements[elements.length - 1].path || [];
//         const newPath = [...path, [offsetX, offsetY] as [number, number]];
//         setElements((prevElements) =>
//           prevElements.map((ele, index) => {
//             if (index === elements.length - 1) {
//               return {
//                 ...ele,
//                 path: newPath,
//               };
//             } else {
//               return ele;
//             }
//           })
//         );
//       } else if (tool === "line") {
//         setElements((prevElements) =>
//           prevElements.map((ele, index) => {
//             if (index === elements.length - 1) {
//               return {
//                 ...ele,
//                 width: offsetX - ele.offsetX,
//                 height: offsetY - ele.offsetY,
//               };
//             } else {
//               return ele;
//             }
//           })
//         );
//       } else if (tool === "rect") {
//         setElements((prevElements) =>
//           prevElements.map((ele, index) => {
//             if (index === elements.length - 1) {
//               return {
//                 ...ele,
//                 width: offsetX - ele.offsetX,
//                 height: offsetY - ele.offsetY,
//               };
//             } else {
//               return ele;
//             }
//           })
//         );
//       }
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDrawing(false);
//   };

//   return (
//     <div
//       className="col-md-11 overflow-hidden border border-dark border-3 px-0 mx-auto mt-3"
//       style={{ height: "480px" }}
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//     >
//       <canvas ref={canvasRef} />
//     </div>
//   );
// };

// export default Canvas;

import React, { useEffect, useLayoutEffect, useState, RefObject } from "react";
import rough from "roughjs";
import "./index.css"

interface Element {
  offsetX: number;
  offsetY: number;
  width?: number;
  height?: number;
  path?: [number, number][];
  stroke: string;
  element: "rect" | "line" | "pencil";
}

interface User {
  presenter: boolean;
  [key: string]: any; // Add additional properties as needed
}

interface CanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  ctx: React.MutableRefObject<CanvasRenderingContext2D | null>; // Use MutableRefObject here
  color: string;
  setElements: React.Dispatch<React.SetStateAction<Element[]>>;
  elements: Element[];
  tool: string;
  user: User;
  socket: any; // You might want to provide a specific type for socket
}

const generator = rough.generator();

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  ctx,
  color,
  setElements,
  elements,
  tool,
  socket,
  user
}) => {

  const [img, setImg] = useState<string | undefined>("");

  useEffect(() => {
    socket.on("whiteBoardDataResponse", (data: { imgURL: string }) => {
      setImg(data.imgURL);
    });
  }, [socket]);

  if (!user?.presenter) {
    return (
      <div className="border border-dark border-3 h-100 w-100 overflow-hidden">
        <img 
          src={img}
          alt="Real-time whiteboard image shared by presenter"
          style={{
            height: window.innerHeight * 2,
            width: "255%",
          }}
        />
      </div>
    );
  }
  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.height = window.innerHeight * 2;
      canvas.width = window.innerWidth * 2;
      const context = canvas.getContext("2d");

      if (context) {
        context.lineWidth = 2;
        context.lineCap = "round";
        context.strokeStyle = color;
        ctx.current = context; // Set the context in the mutable ref
      }
    }
  }, [canvasRef, color, ctx]);

  useEffect(() => {
    if (ctx.current) {
      ctx.current.strokeStyle = color;
    }
  }, [color, ctx]);

  useLayoutEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return; // Check if canvasRef.current is null
    const roughCanvas = rough.canvas(canvasElement);

    if (ctx.current) {
      ctx.current.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }

    elements.forEach((ele) => {
      if (ele.element === "rect") {
        roughCanvas.draw(
          generator.rectangle(ele.offsetX, ele.offsetY, ele.width || 0, ele.height || 0, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "line") {
        roughCanvas.draw(
          generator.line(ele.offsetX, ele.offsetY, ele.offsetX + (ele.width || 0), ele.offsetY + (ele.height || 0), {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "pencil") {
        roughCanvas.linearPath(ele.path || [], {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: 5,
        });
      }
    });

    const canvasImage = canvasRef.current?.toDataURL();
    if (canvasImage && socket) {
      socket.emit("whiteBoardDataResponse", canvasImage);
    } else {
      console.error("Socket is undefined or canvas image is null");
    }
  }, [elements, canvasRef, socket, ctx]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
          element: tool,
        },
      ]);
    } else if (tool === "line") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
          element: tool,
        },
      ]);
    } else if (tool === "rect") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
          element: tool,
        },
      ]);
    }

    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      if (tool === "pencil") {
        const path = elements[elements.length - 1].path || [];
        const newPath = [...path, [offsetX, offsetY] as [number, number]];
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                path: newPath,
              };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "line") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      } else if (tool === "rect") {
        setElements((prevElements) =>
          prevElements.map((ele, index) => {
            if (index === elements.length - 1) {
              return {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              };
            } else {
              return ele;
            }
          })
        );
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="canvas-container">
      <div className="background" />
      <div
        className="col-md-11 overflow-hidden border border-dark border-1 px-0 mx-auto mt-3"
        style={{ height: "480px" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Canvas;
