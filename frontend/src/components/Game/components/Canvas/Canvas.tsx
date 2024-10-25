import useCanvas from '../../../../hooks/useCanvas';
import css from './Canvas.module.css';

const Canvas = (props) => {
  const { className = '', ...rest } = props;
  const { canvasRef, containerRef } = useCanvas();

  return (
    <div ref={containerRef} className={className}>
      <canvas id={css.canvas} ref={canvasRef} {...rest} />
    </div>
  );
};

export default Canvas;
