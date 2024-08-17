import { useEffect, useRef, useState } from 'react';

const useCanvas = (draw) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

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
    if (canvas) {
      const ctx = canvas?.getContext('2d');
      const { width, height } = containerSize;

      // Adjust for device pixel ratio
      const scale = 1; //window.devicePixelRatio || 1;
      canvas.width = width * scale;
      canvas.height = height * scale;

      // Scale the context to ensure proper rendering
      // ctx?.scale(scale, scale);

      // Use the container dimensions for rendering logic
      // ctx?.clearRect(0, 0, width, height);

      // set a backgriund img
      // Load the image
      const backgroundImage = new Image();
      backgroundImage.src = '/game-bg.jpg'; // Replace with your image path

      // Draw the image once it has loaded
      backgroundImage.onload = () => {
        ctx?.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      };

      // game rendering logic here
      let frameCount = 0;
      let animationFrameId: number;
      const render = () => {
        frameCount++;
        draw(ctx, frameCount);
        animationFrameId = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [containerSize]);

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
