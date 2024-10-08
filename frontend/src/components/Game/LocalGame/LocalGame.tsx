// // src/components/LocalGame.tsx
// import React, { useEffect, useRef } from 'react';
// import useGameLogic from '../../../hooks/useGameLogic';
// import { log } from 'console';

// const LocalGame: React.FC = () => {
//   const canvasWidth = 800;
//   const canvasHeight = 400;
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   const { ball, paddle1, paddle2, movePaddle, score1, score2, updateGame } =
//     useGameLogic(canvasWidth, canvasHeight);

//   // Handle keyboard input
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'w') {
//         console.log('ddddd');

//         movePaddle('paddle1', 'up');
//       }
//       if (e.key === 's') movePaddle('paddle1', 'down');
//       if (e.key === 'ArrowUp') movePaddle('paddle2', 'up');
//       if (e.key === 'ArrowDown') movePaddle('paddle2', 'down');
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [movePaddle]);

//   // Render the ball and paddles
//   const draw = () => {
//     const ctx = canvasRef.current?.getContext('2d');
//     if (!ctx) return;

//     // Clear the canvas
//     ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//     // Draw paddles
//     ctx.fillStyle = 'white'; // Paddle color
//     ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height); // Player 1 paddle
//     ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height); // Player 2 paddle

//     // Draw ball
//     ctx.fillStyle = 'black'; // Ball color
//     ctx.beginPath();
//     ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
//     ctx.fill();

//     // Draw scores
//     ctx.fillStyle = 'black';
//     ctx.font = '20px Arial';
//     ctx.fillText(`Player 1: ${score1}`, 50, 30);
//     ctx.fillText(`Player 2: ${score2}`, canvasWidth - 150, 30);
//   };

//   // Game loop to update the canvas
//   const gameLoop = () => {
//     updateGame();
//     draw();
//     // requestAnimationFrame(gameLoop); // Request the next frame
//     setInterval(gameLoop, 1000 / 60);
//   };

//   useEffect(() => {
//     gameLoop(); // Start the game loop when the component mounts
//   }, []);

//   return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
// };

// export default LocalGame;
