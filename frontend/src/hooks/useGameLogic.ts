// src/hooks/useGameLogic.ts
import { useEffect, useState } from 'react';

interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number; // change in x (speed)
  dy: number; // change in y (speed)
}

interface PaddleState {
  x: number;
  y: number;
  width: number;
  height: number;
}

const useGameLogic = (canvasWidth: number, canvasHeight: number) => {
  const paddleWidth = 10;
  const paddleHeight = 80;

  const [paddle1, setPaddle1] = useState<PaddleState>({
    x: 0,
    y: canvasHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
  });

  const [paddle2, setPaddle2] = useState<PaddleState>({
    x: canvasWidth - paddleWidth,
    y: canvasHeight / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
  });

  const [ball, setBall] = useState<Ball>({
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    radius: 10,
    dx: 5, // Speed of the ball in x direction
    dy: 5, // Speed of the ball in y direction
  });

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const movePaddle = (paddle: 'paddle1' | 'paddle2', direction: 'up' | 'down') => {
    if (paddle === 'paddle1') {
      setPaddle1((prev) => ({
        ...prev,
        y: direction === 'up' ? Math.max(prev.y - 10, 0) : Math.min(prev.y + 10, canvasHeight - paddleHeight),
      }));
    } else {
      setPaddle2((prev) => ({
        ...prev,
        y: direction === 'up' ? Math.max(prev.y - 10, 0) : Math.min(prev.y + 10, canvasHeight - paddleHeight),
      }));
    }
  };

  const updateGame = () => {
    setBall((prevBall) => {
      const newBall = { ...prevBall, x: prevBall.x + prevBall.dx, y: prevBall.y + prevBall.dy };

      if (newBall.y - newBall.radius < 0 || newBall.y + newBall.radius > canvasHeight) {
        newBall.dy = -newBall.dy; // Reverse direction
      }

      if (
        (newBall.x - newBall.radius < paddle1.x + paddleWidth &&
          newBall.y > paddle1.y &&
          newBall.y < paddle1.y + paddleHeight) ||
        (newBall.x + newBall.radius > paddle2.x &&
          newBall.y > paddle2.y &&
          newBall.y < paddle2.y + paddleHeight)
      ) {
        newBall.dx = -newBall.dx; // Reverse direction
      }

      if (newBall.x - newBall.radius < 0) {
        setScore2((prev) => prev + 1); // Player 2 scores
        newBall.x = canvasWidth / 2;
        newBall.y = canvasHeight / 2;
      }
      if (newBall.x + newBall.radius > canvasWidth) {
        setScore1((prev) => prev + 1); // Player 1 scores
        newBall.x = canvasWidth / 2;
        newBall.y = canvasHeight / 2;
      }

      return newBall;
    });
  };

  return { ball, paddle1, paddle2, movePaddle, score1, score2, updateGame };
};

export default useGameLogic;
