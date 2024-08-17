import { useState } from 'react';
import GameMode from './components/GameMode/GameMode';
import css from './PongGame.module.css';
import Canvas from './components/Canvas/Canvas';

const Modes = [
  {
    id: 0,
    title: 'local play',
    description: 'two players on the same keyboard',
  },
  { id: 1, title: 'remote play', description: 'play with a friend remotely' },
  { id: 2, title: 'solo play', description: 'play with AI locally' },
  {
    id: 3,
    title: 'battle royal',
    description: 'remote play with multiple players',
  },
  { id: 4, title: 'tournament', description: 'join or create a tournament' },
];

const PongGame = () => {
  const [selectedMode, setSelectedMode] = useState<number | null>(null);

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    const [ball, setBall] = useState({
      radius: 20,
      x: ctx.canvas.width / 2,
      y: ctx.canvas.height / 2,
    });

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const drawBall = () => {
      ctx.beginPath();
      ctx.fillStyle = '#050505';
      ctx.arc(
        ctx.canvas.width - 20,
        ctx.canvas.height - 20,
        20,
        0,
        2 * Math.PI
      );
      ctx.fill();
    };

    drawBall();

    function onmouseDown(e: MouseEvent) {
      console.log(e);
    }
    function onmouseUp(e: MouseEvent) {
      console.log(e);
    }
    function onmouseMove(e: MouseEvent) {
      console.log(e);
    }

    ctx.canvas.addEventListener('mousedown', onmouseDown);
    ctx.canvas.addEventListener('mouseup', onmouseUp);
    ctx.canvas.addEventListener('mousemove', onmouseMove);

    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  if (selectedMode === 0)
    return (
      <>
        <p>Score</p>
        <Canvas className={css.canvasContainer} draw={draw} />
      </>
    );
  return (
    <>
      <div className={css.title}>
        <p className={css.cornerBorder}>mode</p>
      </div>
      <ul className={css.modes}>
        {Modes.map((m, i) => (
          <GameMode
            key={i}
            onSelect={() => setSelectedMode(m.id)}
            title={m.title}
            desc={m.description}
          />
        ))}
      </ul>
    </>
  );
};

export default PongGame;
