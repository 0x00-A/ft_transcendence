import React, { useEffect, useRef, useState } from 'react';

const PingPongGame = () => {
  const canvasRef = useRef(null);
  const [paddle1, setPaddle1] = useState({
    x: 0,
    y: 150,
    width: 10,
    height: 100,
    vy: 0,
  });
  const [paddle2, setPaddle2] = useState({
    x: 790,
    y: 150,
    width: 10,
    height: 100,
    vy: 0,
  });
  const [ball, setBall] = useState({
    x: 400,
    y: 200,
    vx: 3,
    vy: 3,
    radius: 10,
    color: 'white',
  });
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  // Sounds
  const hitWallSound = new Audio('wall-hit-1.mp3');
  const paddleHitSound = new Audio('paddle-hit-1.mp3');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const moveBall = () => {
      setBall((prevBall) => {
        const newBall = { ...prevBall };
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;

        // Collision with top and bottom walls
        if (newBall.y + newBall.radius > canvas.height || newBall.y - newBall.radius < 0) {
          newBall.vy *= -1;
        }

        // Collision with paddles
        if (ballHitsPaddle(paddle1) || ballHitsPaddle(paddle2)) {
          newBall.vx *= -1;
          paddleHitSound.play();
        }

        // Scoring
        if (newBall.x + newBall.radius > canvas.width) {
          setScore1((prevScore) => prevScore + 1);
          resetBall(newBall);
        } else if (newBall.x - newBall.radius < 0) {
          setScore2((prevScore) => prevScore + 1);
          resetBall(newBall);
        }

        return newBall;
      });
    };

    const ballHitsPaddle = (paddle) => {
      return (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height
      );
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = (paddle) => {
      ctx.fillStyle = 'white';
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    };

    const drawScores = () => {
      ctx.font = '30px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(score1, canvas.width / 4, 30);
      ctx.fillText(score2, (canvas.width / 4) * 3, 30);
    };

    const resetBall = (newBall) => {
      newBall.x = canvas.width / 2;
      newBall.y = canvas.height / 2;
      newBall.vx *= -1;
      newBall.vy = (Math.random() - 0.5) * 6;
    };

    const movePaddles = () => {
      setPaddle1((prevPaddle) => {
        const newPaddle = { ...prevPaddle };
        newPaddle.y += newPaddle.vy;
        return {
          ...newPaddle,
          y: Math.max(Math.min(newPaddle.y, canvas.height - paddle1.height), 0),
        };
      });

      setPaddle2((prevPaddle) => {
        const newPaddle = { ...prevPaddle };
        newPaddle.y += newPaddle.vy;
        return {
          ...newPaddle,
          y: Math.max(Math.min(newPaddle.y, canvas.height - paddle2.height), 0),
        };
      });
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveBall();
      movePaddles();
      drawPaddle(paddle1);
      drawPaddle(paddle2);
      drawBall();
      drawScores();

      requestAnimationFrame(gameLoop);
    };

    const handleKeydown = (event) => {
      switch (event.key) {
        case 'w':
          setPaddle1((prev) => ({ ...prev, vy: -5 }));
          break;
        case 's':
          setPaddle1((prev) => ({ ...prev, vy: 5 }));
          break;
        case 'ArrowUp':
          setPaddle2((prev) => ({ ...prev, vy: -5 }));
          break;
        case 'ArrowDown':
          setPaddle2((prev) => ({ ...prev, vy: 5 }));
          break;
        default:
          break;
      }
    };

    const handleKeyup = (event) => {
      switch (event.key) {
        case 'w':
        case 's':
          setPaddle1((prev) => ({ ...prev, vy: 0 }));
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          setPaddle2((prev) => ({ ...prev, vy: 0 }));
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
    };
  }, [ball, paddle1, paddle2, score1, score2]);

  return <canvas id="gameCanvas" ref={canvasRef} width="800" height="400" />;
};

export default PingPongGame;
