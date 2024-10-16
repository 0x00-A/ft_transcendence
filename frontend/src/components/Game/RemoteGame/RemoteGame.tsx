import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Controller, GameScreens, GameState } from '../../../types/types';
import css from './RemoteGame.module.css';
import MultiPlayerPong from '../components/MultiPlayerPong/MultiPlayerPong';
import EndGameScreen from '../components/EndGameScreen/EndGameScreen';

const canvasWidth = 650;
const canvasHeight = 480;

const RemoteGame: React.FC = () => {
  const ws = useRef<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState>(null);
  const [restart, setRestart] = useState(false);

  const [currentScreen, setCurrentScreen] = useState<GameScreens>('game'); // Starting screen is 'mode'
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [isOnePlayerMode, SetIsOnePlayerMode] = useState(false);
  const [ballSpeed, setBallSpeed] = useState(5);
  const [paddleSpeed, SetPaddleSpeed] = useState(10);
  const [sound, SwitchSound] = useState(true);
  const [controller, setController] = useState<Controller>('mouse');
  const [winningScore, setWinningScore] = useState(7);

  //pong
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  // useEffect(() => {
  //   const handleBeforeUnload = (event: any) => {
  //     event.preventDefault();
  //     event.returnValue = ''; // Modern browsers require this for custom prompts
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGameState(null);
      const gameSocket = new WebSocket('ws://localhost:8000/ws/matchmaking/');
      ws.current = gameSocket;

      gameSocket.onopen = (e) => {
        console.log('WebSocket connected');
        setGameState('waiting');

        // Send the canvas dimensions
        const message = {
          type: 'CONNECT',
          canvasWidth: canvasWidth,
          canvasHeight: canvasHeight,
        };
        gameSocket.send(JSON.stringify(message));
      };

      gameSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === 'game_started') {
          console.log('game_stared...', data.game_room_id);
          setGameState('started');
        }
        if (data.type === 'player_disconnected') {
          console.log('player_disconnected...');
          setGameState('disconnected');
        }
      };

      gameSocket.onclose = (e) => {
        console.log('WebSocket Disconnected');
        setGameState('ended');
      };

      return () => {
        gameSocket.close();
      };
    }, 500);

    return () => clearTimeout(timeout);
  }, [restart]);

  useEffect(() => {
    if (isGameOver || gameState != 'started') return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const updateScore = (isPlayer: boolean = false) => {
      // left and right collision
      // ball.dx *= -1;
      isPlayer ? setScore1((s) => s + 1) : setScore2((s) => s + 1);
      if (score1 + 1 >= winningScore || score2 + 1 >= winningScore) {
        setIsGameOver(true);
        isPlayer ? setIsWinner(true) : setIsWinner(false);
        // onNext('end');
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') {
      }
      if (e.key === 's' || e.key === 'S') {
      }
      // if (e.key === 'ArrowUp') paddle2.dy = -paddle2.speed;
      // if (e.key === 'ArrowDown') paddle2.dy = paddle2.speed;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 's' || e.key === 'W' || e.key === 'S') {
      }
      // paddle1.dy = 0;
      // if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2.dy = 0;
    };

    let animationFrameId: number;
    const animate = () => {
      if (isGameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawDashedLine();
      // checkCollision();
      // ball.move();
      // if (controller !== 'mouse') paddle1.move();
      // paddle1.ai(ball, true);
      // isOnePlayerMode ? paddle2.ai(ball) : paddle2.move();
      // ball.draw();
      // paddle1.draw();
      // paddle2.draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('keydown', (e) => handleKeyDown(e));
    window.addEventListener('keyup', (e) => handleKeyUp(e));
    // canvas.addEventListener('mousemove', (e) => handleMouseMove(e));
    animate();

    return () => {
      window.removeEventListener('keydown', (e) => handleKeyDown(e));
      window.removeEventListener('keyup', (e) => handleKeyUp(e));
      // canvas.removeEventListener('mousemove', (e) => handleMouseMove(e));
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGameOver, score1, score2]);

  const handleNextScreen = (nextScreen: GameScreens) => {
    setCurrentScreen(nextScreen);
  };
  const handleRetry = () => {
    setGameState(null);
    setCurrentScreen('game');
    setIsGameOver(false);
    setRestart((s) => !s);
  };
  const handleMainMenu = () => {
    setCurrentScreen('mode');
    setIsGameOver(false);
  };

  return (
    <div>
      {!gameState && <h1>Remote Play - connecting to websocket!</h1>}
      {gameState === 'disconnected' && (
        <div>
          <h1>Remote Play - disconnected!</h1>
          <button onClick={() => setRestart((s) => !s)}>Play Again</button>
        </div>
      )}
      {gameState === 'waiting' && <h1>Remote Play - waiting!</h1>}
      {gameState === 'started' && (
        <div className={css.gameArea}>
          {currentScreen === 'game' && (
            <div id="gameScreen" className={css.gameScreenDiv}>
              <div className={css.scoreWrapper}>
                <div className={css.player1Score}>{score1}</div>
                <div className={css.player2Score}>{score2}</div>
              </div>
              {/* <div id="pauseDiv" style="display: none;">
                Paused, press P to continue
              </div> */}
              <canvas
                width={canvasWidth}
                height={canvasHeight}
                id={css.gameCanvas}
                ref={canvasRef}
              />
            </div>
          )}
          {currentScreen === 'end' && (
            <EndGameScreen
              isWinner={isWinner}
              handleRetry={handleRetry}
              handleMainMenu={handleMainMenu}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RemoteGame;
