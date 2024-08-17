import useCanvas from '../../../../../hooks/useCanvas';

const Canvas = (props) => {
  const { draw, className = '', ...rest } = props;
  const { canvasRef, containerRef } = useCanvas(draw);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} {...rest} />
    </div>
  );
};

export default Canvas;
