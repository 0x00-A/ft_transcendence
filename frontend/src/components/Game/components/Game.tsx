// Game.tsx
import React, { useEffect, useRef, useState } from 'react';
import Paddle from './Paddle';
import Ball from './Ball';
import { calculateBallMovement } from './GameLogic';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paddle1Pos, setPaddle1Pos] = useState({ x: 50, y: 200 });
  const [paddle2Pos, setPaddle2Pos] = useState({ x: 750, y: 200 });
  const [ballPos, setBallPos] = useState({ x: 400, y: 300 });
  const [ballVelocity, setBallVelocity] = useState({ x: 2, y: 2 });
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  const paddleHeight = 100;
  const paddleWidth = 20;
  const ballRadius = 10;

  const movePaddle = (player: number, direction: number) => {
    if (player === 1) {
      setPaddle1Pos((prev) => ({
        x: prev.x,
        y: Math.max(0, Math.min(prev.y + direction, 500 - paddleHeight)),
      }));
    } else {
      setPaddle2Pos((prev) => ({
        x: prev.x,
        y: Math.max(0, Math.min(prev.y + direction, 500 - paddleHeight)),
      }));
    }
  };

  const keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'w') movePaddle(1, -10);
    if (e.key === 's') movePaddle(1, 10);
    if (e.key === 'ArrowUp') movePaddle(2, -10);
    if (e.key === 'ArrowDown') movePaddle(2, 10);
  };

  useEffect(() => {
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const gameLoop = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas?.width, canvas.height);

        // Calculate ball movement
        const { newBallPos, score } = calculateBallMovement(
          ballPos,
          ballVelocity,
          800,
          500,
          paddle1Pos,
          paddle2Pos,
          paddleHeight,
          paddleWidth
        );

        // Update ball position
        setBallPos(newBallPos);

        if (score) {
          // Handle score update logic
          if (newBallPos.x < 400) {
            setScores((prev) => ({ ...prev, player2: prev.player2 + 1 }));
          } else {
            setScores((prev) => ({ ...prev, player1: prev.player1 + 1 }));
          }
        }

        // Draw paddles and ball
        ctx.fillStyle = 'white';
        ctx.fillRect(paddle1Pos.x, paddle1Pos.y, paddleWidth, paddleHeight);
        ctx.fillRect(paddle2Pos.x, paddle2Pos.y, paddleWidth, paddleHeight);
        ctx.beginPath();
        ctx.arc(ballPos.x, ballPos.y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, [ballPos, ballVelocity, paddle1Pos, paddle2Pos]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        style={{ background: 'black' }}
      />
      <div>
        <p>Player 1: {scores.player1}</p>
        <p>Player 2: {scores.player2}</p>
      </div>
    </div>
  );
};

export default Game;
