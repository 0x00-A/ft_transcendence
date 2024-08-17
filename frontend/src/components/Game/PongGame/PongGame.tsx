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
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#853535';
    ctx.beginPath();
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#050505';
    ctx.arc(ctx.canvas.width - 20, ctx.canvas.height - 20, 20, 0, 2 * Math.PI);
    ctx.fill();
  };

  if (selectedMode === 0) return <Canvas className={css.canvas} draw={draw} />;
  return (
    <>
      <div className={css.title}>
        <p className={css.cornerBorder}>mode</p>
      </div>
      <ul className={css.modes}>
        {Modes.map((m) => (
          <GameMode
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
