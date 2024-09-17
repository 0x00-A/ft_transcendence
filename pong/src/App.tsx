import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ball, setBall] = useState({ x: 50, y: 50, rad: 20 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      ctx.canvas.width = 800;
      ctx.canvas.height = 400;
      const drawBall = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = "#2d2d2d";
        ctx.arc(ball.x, ball.y, ball.rad, 0, 2 * Math.PI);
        ctx.fill();
      };

      drawBall();

      const handleMouseDown = (e: MouseEvent) => {
        console.log(e);
        const rect = canvas.getBoundingClientRect();
        console.log(rect);
      };
      const handleMouseUp = (e: MouseEvent) => {
        // console.log(e);
      };
      const handleMouseMove = (e: MouseEvent) => {
        // console.log(e);
      };

      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mouseup", handleMouseUp);
      canvas.addEventListener("mousemove", handleMouseMove);

      return () => {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mouseup", handleMouseUp);
        canvas.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  return <canvas className="canvas" ref={canvasRef}></canvas>;
}

export default App;
