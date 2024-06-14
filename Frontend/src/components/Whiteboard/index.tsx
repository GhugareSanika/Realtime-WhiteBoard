// import React, { useEffect, RefObject, MutableRefObject, MouseEvent, useState, useLayoutEffect } from "react";
// import rough from "roughjs";
// import { RoughCanvas } from "roughjs/bin/canvas";

// interface WhiteBoardProps {
//   canvasRef: RefObject<HTMLCanvasElement>;
//   ctxRef: MutableRefObject<CanvasRenderingContext2D | null>;
//   elements: DrawingElement[];
  
//   setElements: React.Dispatch<React.SetStateAction<DrawingElement[]>>;
// }

// interface PencilElement {
//   type: "pencil";
//   offsetX: number;
//   offsetY: number;
//   path: [number, number][];
//   stroke: string;
// }

// interface LineElement {
//   type: "line";
//   offsetX: number;
//   offsetY: number;
//   width: number;
//   height: number;
//   stroke: string;
// }

// type DrawingElement = PencilElement | LineElement;

// const roughGenerator = rough.generator();

// const WhiteBoard: React.FC<WhiteBoardProps> = ({ canvasRef, ctxRef, elements, setElements }) => {
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [tool, setTool] = useState("pencil"); 

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       canvas.height = window.innerHeight * 2;
//       canvas.width = window.innerWidth * 2;
//       const ctx = canvas.getContext("2d");
  
//       ctxRef.current = ctx;
//     }

//   }, []);

//   useLayoutEffect(()=>{
    
//     if(canvasRef.current && ctxRef.current){
//     const roughCanvas:RoughCanvas = rough.canvas(canvasRef.current);

//     if(elements.length > 0){
//       ctxRef.current.clearRect(
//         0,
//         0,
//         canvasRef.current.width,
//         canvasRef.current.height
//       )
//     }
//     elements.forEach((element)=>{
//       if(element.type === "line"){
//         roughCanvas.draw(
//           roughGenerator.line(
//             element.offsetX,
//             element.offsetY,
//             element.width,
//             element.height
//           )
//         );
//       }else if(element.type === "pencil"){
//         roughCanvas.linearPath(element.path);
//       }
//     })
//   }
//   },[elements])

//   const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
//     const { offsetX, offsetY } = e.nativeEvent;

//     if (tool === "pencil") {
//       setElements((prevElements) => [
//         ...prevElements,
//         {
//           type: "pencil",
//           offsetX,
//           offsetY,
//           path: [[offsetX, offsetY]],
//           stroke: "black",
//         } as PencilElement,
//       ]);
//     } else if (tool === "line") {
//       setElements((prevElements) => [
//         ...prevElements,
//         {
//           type: "line",
//           offsetX,
//           offsetY,
//           width: 0,
//           height: 0,
//           stroke: "black",
//         } as LineElement,
//       ]);
//     }
//     setIsDrawing(true);
//   };

//   const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
//     const { offsetX, offsetY } = e.nativeEvent;

//     if (isDrawing) {
//       if (tool === "pencil") {
//         const { path } = elements[elements.length - 1] as PencilElement;
//         const newPath: [number, number][] = [...path, [offsetX, offsetY]];

//         setElements((prevElements) =>
//           prevElements.map((ele, index) => {
//             if (index === elements.length - 1 && ele.type === "pencil") {
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
//             if (index === elements.length - 1 && ele.type === "line") {
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
//     <>
//     <canvas
//       ref={canvasRef}
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       className="border border-dark border-3 h-100 w-100 overflow-hidden"
//     ></canvas>
//     </>
//   );
// }
// export default WhiteBoard;

import React, { useEffect, useLayoutEffect, useState, RefObject } from "react";
import rough from "roughjs";

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
  ctx: RefObject<CanvasRenderingContext2D | null>;
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
  const [isDrawing, setIsDrawing] = useState(false);

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
            width: "235%",
          }}
        />
      </div>
    );
  }

  

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.height = window.innerHeight * 2;
      canvas.width = window.innerWidth * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const context = canvas.getContext("2d");

      if (context) {
        context.lineWidth = 5;
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = color;
      }
    }
  }, [canvasRef, color]);

  useEffect(() => {
    if (ctx.current) {
      ctx.current.strokeStyle = color;
    }
  }, [color]);

  useLayoutEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return; // Check if canvasRef.current is null
    const roughCanvas = rough.canvas(canvasElement);

    if (elements.length > 0 && ctx.current) {
      ctx.current.clearRect(
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );
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
          generator.line(ele.offsetX, ele.offsetY, ele.width || 0, ele.height || 0, {
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
  }, [elements, canvasRef, socket]);

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
        } as Element,
      ]);
    } else {
      setElements((prevElements) => [
        ...prevElements,
        { offsetX, offsetY, stroke: color, element: tool } as Element,
      ]);
    }

    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "rect") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    } else if (tool === "line") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX,
                height: offsetY,
                stroke: ele.stroke,
                element: ele.element,
              } 
            : ele
        )
      );
    } else if (tool === "pencil") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                path: [...(ele.path || []), [offsetX, offsetY]],
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };


  return (
    <div
      className="col-md-11 overflow-hidden border border-dark border-3 px-0 mx-auto mt-3"
      style={{ height: "460px" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
