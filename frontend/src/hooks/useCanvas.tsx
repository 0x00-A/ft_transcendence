import { useEffect, useRef } from 'react';

const useCanvas = (draw) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) throw new Error('null ref');
    canvas.width = 1000;
    canvas.height = 1000;

    const ctx = canvas?.getContext('2d');

    let frameCount = 0;
    let animationFrameId: number;
    const render = () => {
      frameCount++;
      draw(ctx, frameCount);
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    // draw(ctx);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return ref;
};

export default useCanvas;
