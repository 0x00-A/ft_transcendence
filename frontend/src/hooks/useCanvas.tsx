import { useEffect, useRef, useState } from 'react';

const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [ball, setBall] = useState({
    radius: 20,
    x: 50,
    y: 50,
  });
  const [isDragged, setIsDragged] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const { width, height } = containerSize;

      // Adjust for device pixel ratio
      const scale = 1; //window.devicePixelRatio || 1;
      canvas.width = width * scale;
      canvas.height = height * scale;

      // Scale the context to ensure proper rendering
      // ctx?.scale(scale, scale);

      // Use the container dimensions for rendering logic
      // ctx?.clearRect(0, 0, width, height);

      // game rendering logic here
      // let frameCount = 0;
      // let animationFrameId: number;
      // const render = () => {
      //   frameCount++;
      //   draw(ctx, frameCount);
      //   animationFrameId = requestAnimationFrame(render);
      // };

      const drawBall = () => {
        ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);
        ctx?.beginPath();
        ctx.fillStyle = '#050505';
        ctx?.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        ctx?.fill();
      };

      function onmouseDown(e: MouseEvent) {
        setIsDragged(true);
      }
      function onmouseUp(e: MouseEvent) {
        setIsDragged(false);
      }
      function onmouseMove(e: MouseEvent) {}

      ctx.canvas.addEventListener('mousedown', onmouseDown);
      ctx.canvas.addEventListener('mouseup', onmouseUp);
      ctx.canvas.addEventListener('mousemove', onmouseMove);
      // render();
      drawBall();

      // return () => cancelAnimationFrame(animationFrameId);
      return () => {
        ctx.canvas.removeEventListener('mousedown', onmouseDown);
        ctx.canvas.removeEventListener('mouseup', onmouseUp);
        ctx.canvas.removeEventListener('mousemove', onmouseMove);
      };
    }
  }, [containerSize, ball]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     canvas.width = containerSize.width;
  //     canvas.height = containerSize.height;
  //     // You can now use these dimensions for your game rendering logic
  //   }
  // }, [containerSize]);
  return { canvasRef, containerRef };
};

export default useCanvas;
