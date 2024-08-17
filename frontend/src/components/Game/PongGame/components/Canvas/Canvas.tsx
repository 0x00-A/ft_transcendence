import useCanvas from '../../../../../hooks/useCanvas';
import css from './Canvas.module.css';

const Canvas = (props) => {
  const { draw, className = '', ...rest } = props;
  const { canvasRef, containerRef } = useCanvas(draw);

  return (
    <div ref={containerRef} className={className}>
      <canvas id={css.canvas} ref={canvasRef} {...rest} />
    </div>
  );
};

export default Canvas;
