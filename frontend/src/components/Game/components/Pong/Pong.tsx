// Game.tsx
import React, { useEffect, useRef, useState } from 'react';
import Paddle from '../utils/Paddle';
import Ball from '../utils/Ball';
import {
  isCollidingWithPaddle,
  handlePaddleCollision,
} from '../utils/GameLogic';
import css from './Pong.module.css';
import { Controller, GameScreens } from '../../../../types/types';

function create_ball(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  ballSpeed: number
) {
  const initialAngle = (Math.random() * Math.PI) / 2 - Math.PI / 4; // Random angle between -45° and 45°
  // const ballSpeed = 6;
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

interface GameProps {
  controlMode?: 'keyboard' | 'mouse';
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  isGameOver: boolean;
  setIsWinner: React.Dispatch<React.SetStateAction<boolean>>;
  isOnePlayerMode: boolean;
  onNext: (nextScreen: GameScreens) => void;
  sound: boolean;
  paddleSpeed: number;
  ballSpeed: number;
  controller: Controller;
  winningScore: number;
}

const Pong: React.FC<GameProps> = ({
  controlMode = 'mouse',
  isGameOver,
  setIsGameOver,
  setIsWinner,
  isOnePlayerMode,
  onNext,
  sound,
  paddleSpeed,
  ballSpeed,
  controller,
  winningScore,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  // const [hitWallSound] = useSound('../../sounds/wall-hit-1.mp3');

  let hitWallSound = new Audio(
    'https://dl.sndup.net/ckxyx/wall-hit-1_[cut_0sec]%20(1).mp3'
  );
  let paddleHitSound = new Audio(
    'https://dl.sndup.net/7vg3z/paddle-hit-1_[cut_0sec].mp3'
  );

  useEffect(() => {
    if (isGameOver) return;
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
  }, [isGameOver]);

  useEffect(() => {
    hitWallSound.preload = 'auto';
    hitWallSound.load(); // Preloads the audio into the browser's memory
    paddleHitSound.preload = 'auto';
    paddleHitSound.load(); // Preloads the audio into the browser's memory
  }, [sound]);

  useEffect(() => {
    if (isGameOver) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pW = 10;
    const pH = 100;
    // const paddleSpeed = 5;
    // const winningScore = 5;

    const ball = create_ball(ctx, canvas, ballSpeed);
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

    function getRandomValue(paddleHeight: number): number {
      // Generate a random integer between 0 and paddleHeight (inclusive)
      // return Math.floor(Math.random() * (paddleHeight + 1)); // +1 to include paddleHeight
      return Math.floor(
        Math.random() * ((3 * paddleHeight) / 4 - paddleHeight / 4) +
          paddleHeight / 4
      );
    }

    const resetBall = () => {
      ball.x = ball.dx > 0 ? (3 * canvas.width) / 4 : canvas.width / 4;
      ball.y = canvas.height / 2;
      ball.dx *= -1; // Switch direction of the serve
      ball.dy = (Math.random() - 0.5) * 6;
    };

    const updateScore = (isPlayer: boolean = false) => {
      // left and right collision
      // ball.dx *= -1;
      isPlayer ? setScore1((s) => s + 1) : setScore2((s) => s + 1);
      if (score1 + 1 >= winningScore || score2 + 1 >= winningScore) {
        setIsGameOver(true);
        isPlayer ? setIsWinner(true) : setIsWinner(false);
        onNext('end');
      }
      resetBall();
    };

    const checkCollision = () => {
      // next move top and bottom collision
      let newX = ball.x + ball.dx + (ball.dx > 0 ? ball.radius : -ball.radius);
      let newY = ball.y + ball.dy + (ball.dy > 0 ? ball.radius : -ball.radius);

      // reverse the ball direction
      if (newY >= canvas.height || newY <= 0) {
        // hitWallSound.load();
        // paddleHitSound.load();
        sound && hitWallSound.play();

        ball.dy *= -1;
      }

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

        sound && paddleHitSound.play();
        handlePaddleCollision(ball, paddle1);
        paddle1.paddleHitPoint = getRandomValue(paddle1.height);
      } else if (isCollidingWithPaddle(ball, paddle2)) {
        sound && paddleHitSound.play();
        handlePaddleCollision(ball, paddle2);
        paddle2.paddleHitPoint = getRandomValue(paddle2.height);
      } else if (newX >= canvas.width) {
        updateScore(true);
      } else if (newX <= 0) {
        updateScore(false);
      }
    };

    const drawDashedLine = () => {
      ctx.setLineDash([10, 10]); // [dash length, gap length]
      ctx.strokeStyle = 'gray';
      ctx.lineWidth = 6;

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0); // Start at the top of the canvas
      ctx.lineTo(canvas.width / 2, canvas.height); // Draw to the bottom of the canvas
      ctx.stroke();
      ctx.setLineDash([]); // Reset the line dash to solid for other drawings
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect(); // Get the canvas's position and size
      // const mouseX = e.clientX - rect.left; // X coordinate inside the canvas
      const mouseY = e.clientY - rect.top; // Y coordinate inside the canvas
      // console.log(`Mouse X: ${mouseX}, Mouse Y: ${mouseY}`);
      if (controller === 'mouse') {
        if (
          mouseY >= paddle1.height / 2 &&
          mouseY <= canvas.height - paddle1.height / 2
        )
          paddle1.y = mouseY - paddle1.height / 2;
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

    let animationFrameId: number;
    const animate = () => {
      if (isGameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawDashedLine();
      checkCollision();
      ball.move();
      if (controller !== 'mouse') paddle1.move();
      // paddle1.ai(ball, true);
      isOnePlayerMode ? paddle2.ai(ball) : paddle2.move();
      ball.draw();
      paddle1.draw();
      paddle2.draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('keydown', (e) => handleKeyDown(e));
    window.addEventListener('keyup', (e) => handleKeyUp(e));
    canvas.addEventListener('mousemove', (e) => handleMouseMove(e));
    animate();

    return () => {
      window.removeEventListener('keydown', (e) => handleKeyDown(e));
      window.removeEventListener('keyup', (e) => handleKeyUp(e));
      canvas.removeEventListener('mousemove', (e) => handleMouseMove(e));
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGameOver, score1, score2]);

  return (
    <div id="gameScreen" className={css.gameScreenDiv}>
      <div className={css.scoreWrapper}>
        <div className={css.player1Score}>{score1}</div>
        <div className={css.player2Score}>{score2}</div>
      </div>
      {/* <div id="pauseDiv" style="display: none;">
        Paused, press P to continue
      </div> */}
      {/* <canvas
        id="gameCanvas"
        width="650"
        height="480"
        style="cursor: pointer;"
      ></canvas> */}
      <canvas id={css.gameCanvas} ref={canvasRef} />
    </div>
  );
};

export default Pong;
