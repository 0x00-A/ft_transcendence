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

      const drawBall = () => {
        ctx?.clearRect(0, 0, ctx?.canvas.width, ctx?.canvas.height);
        ctx?.beginPath();
        ctx.fillStyle = '#050505';
        ctx?.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        ctx?.fill();
      };

    }
  }, [containerSize, ball]);

  return { canvasRef, containerRef };
};

export default useCanvas;
