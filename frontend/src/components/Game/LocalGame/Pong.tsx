// Game.tsx
import React, { useEffect, useRef, useState } from 'react';
import Paddle from '../components/Paddle';
import Ball from '../components/Ball';
import {
  isCollidingWithPaddle,
  handlePaddleCollision,
} from '../components/GameLogic';
import css from './Pong.module.css';
import { log } from 'console';

function create_ball(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  const initialAngle = (Math.random() * Math.PI) / 2 - Math.PI / 4; // Random angle between -45° and 45°
  const ballSpeed = 10;
  const ballRaduis = 8;

  // Initial random direction towards a player
  const serveDirection = Math.random() < 0.5 ? 1 : -1; // 1 = right (Player 2), -1 = left (Player 1)

  let ballDx = serveDirection * ballSpeed * Math.cos(initialAngle);
  let ballDy = ballSpeed * Math.sin(initialAngle);
  return new Ball(
    ctx,
    canvas.width / 2,
    canvas.height / 2,
    ballRaduis,
    ballDx,
    ballDy
  );
}

type GameMode = 'ai' | 'local';

interface GameProps {
  gameMode: GameMode;
}

const Pong: React.FC<GameProps> = ({ gameMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const resizeCanvas = () => {
      const rect = (
        canvasRef.current?.parentNode as Element
      )?.getBoundingClientRect();

      // Get the computed styles of the parent to calculate border width
      const computedStyle = window.getComputedStyle(
        canvasRef.current?.parentNode as Element
      );
      const borderLeft = parseFloat(computedStyle.borderLeftWidth);
      const borderRight = parseFloat(computedStyle.borderRightWidth);
      const borderTop = parseFloat(computedStyle.borderTopWidth);
      const borderBottom = parseFloat(computedStyle.borderBottomWidth);

      // Set canvas width and height by subtracting borders from parent width and height
      if (canvasRef.current) {
        canvasRef.current.width = rect.width - borderLeft - borderRight;
        canvasRef.current.height = rect.height - borderTop - borderBottom;
      }

      const pixelRatio = window.devicePixelRatio || 1;

      // Set transformation
      //   ctx.setTransform(
      //     (canvas.width / coordinateWidth) * pixelRatio,
      //     0,
      //     0,
      //     (canvas.height / coordinateHeight) * pixelRatio,
      //     0,
      //     0
      //   );
    };

    resizeCanvas();

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

    return window.removeEventListener('resize', () => {
      resizeCanvas();
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pW = 10;
    const pH = 100;
    const paddleSpeed = 15;

    const ball = create_ball(ctx, canvas);
    const paddle1: Paddle = new Paddle(
      ctx,
      10,
      canvas.height / 2 - pH / 2,
      pW,
      pH,
      paddleSpeed
    );
    const paddle2: Paddle = new Paddle(
      ctx,
      canvas.width - 10 - pW,
      canvas.height / 2 - pH / 2,
      pW,
      pH,
      paddleSpeed
    );

    function getRandomIntegerHeightValue(paddleHeight: number): number {
      // Generate a random integer between 0 and paddleHeight (inclusive)
      return Math.floor(Math.random() * (paddleHeight + 1)); // +1 to include paddleHeight
    }

    const resetGame = () => {
      resetBall();
      paddle1.y = canvas.height / 2 - pH / 2;
      paddle2.y = canvas.height / 2 - pH / 2;
    };

    const resetBall = () => {
      ball.x = ball.dx > 0 ? (3 * canvas.width) / 4 : canvas.width / 4;
      ball.y = canvas.height / 2;
      ball.dx *= -1; // Switch direction of the serve
      ball.dy = (Math.random() - 0.5) * 6;
    };

    const checkCollision = () => {
      // next move top and bottom collision
      let newX = ball.x + ball.dx + (ball.dx > 0 ? ball.radius : -ball.radius);
      let newY = ball.y + ball.dy + (ball.dy > 0 ? ball.radius : -ball.radius);

      // reverse the ball direction
      if (newY >= canvas.height || newY <= 0) ball.dy *= -1;

      if (newY <= 0) {
        // Collision with the top wall
        // ball.dy = -ball.dy; // Reverse Y velocity
        ball.y = ball.radius; // Position just outside the wall
      } else if (newY >= canvas.height) {
        // Collision with the bottom wall
        // ball.dy = -ball.dy; // Reverse Y velocity
        ball.y = canvas.height - ball.radius; // Position just outside the wall
      }
      // if (newX >= canvas.width || newX <= 0) this.dx *= -1;

      // paddle collision
      if (isCollidingWithPaddle(ball, paddle1)) {
        // Handle collision, like reversing the ball's direction
        // ball.vx *= -1; // Reverse horizontal direction on collision

        handlePaddleCollision(ball, paddle1);
        paddle1.paddleHitPoint = getRandomIntegerHeightValue(paddle1.height);
      } else if (isCollidingWithPaddle(ball, paddle2)) {
        handlePaddleCollision(ball, paddle2);
        paddle2.paddleHitPoint = getRandomIntegerHeightValue(paddle2.height);
      } else if (newX >= canvas.width) {
        // left and right collision
        // ball.dx *= -1;
        paddle1.score += 1;
        resetGame();
      } else if (newX <= 0) {
        // ball.dx *= -1;
        paddle2.score += 1;
        resetGame();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') paddle1.dy = -paddle1.speed;
      if (e.key === 's' || e.key === 'S') paddle1.dy = paddle1.speed;
      if (e.key === 'ArrowUp') paddle2.dy = -paddle2.speed;
      if (e.key === 'ArrowDown') paddle2.dy = paddle2.speed;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 's' || e.key === 'W' || e.key === 'S')
        paddle1.dy = 0;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2.dy = 0;
    };

    const drawScores = () => {
      // Draw scores on the canvas
      ctx.font = '48px Courier New'; // Increased font size to 48px
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      // Player 1 score
      ctx.fillText(`${paddle1.score}`, canvas.width / 4, 50);

      // Player 2 score
      ctx.fillText(`${paddle2.score}`, (canvas.width * 3) / 4, 50);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      checkCollision();
      ball.move();
      paddle1.move();
      // paddle1.ai(ball, true);
      if (gameMode === 'local') paddle2.move();
      else paddle2.ai(ball);
      ball.draw();
      paddle1.draw();
      paddle2.draw();
      drawScores();
      requestAnimationFrame(animate);
    };

    window.addEventListener('keydown', (e) => handleKeyDown(e));
    window.addEventListener('keyup', (e) => handleKeyUp(e));
    animate();
  }, []);

  return (
    <div className={css.canvasContainer}>
      <canvas id={css.gameCanvas} ref={canvasRef} />

      <div>
        {/* <p>Player 1: {scores.player1}</p>
        <p>Player 2: {scores.player2}</p> */}
      </div>
    </div>
  );
};

export default Pong;
