import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Controller, GameScreens, GameState } from '../../../types/types';
import css from './RemoteGame.module.css';
import MultiPlayerPong from '../components/MultiPlayerPong/MultiPlayerPong';
import EndGameScreen from '../components/EndGameScreen/EndGameScreen';
import { boolean } from 'yup';
import getWebSocketUrl from '../../../utils/getWebSocketUrl';
import { getToken } from '../../../utils/getToken';
import { useParams } from 'react-router-dom';
import ArcadeLoader from '../components/ArcadeLoader/ArcadeLoader';

const canvasWidth = 650;
const canvasHeight = 480;
const FRAME_RATE = 60;
const interval = 1000 / FRAME_RATE; // 60 FPS
const pW = 20;
const pH = 80;
const paddleSpeed = 2;

const RemoteGame: React.FC<{ game_address: string; requestRemoteGame:() => void; setState: React.Dispatch<React.SetStateAction<string>>}> = ({ game_address,requestRemoteGame, setState }) => {
  // const { game_address } = useParams();
  const ws = useRef<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState>(null);
  const [restart, setRestart] = useState(false);

  const [currentScreen, setCurrentScreen] = useState<GameScreens>('game');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  // const [paddleSpeed, SetPaddleSpeed] = useState(10);
  const [sound, SwitchSound] = useState(true);
  const [winningScore, setWinningScore] = useState(7);

  //pong
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const hitWallSound = useRef(
    new Audio('https://dl.sndup.net/ckxyx/wall-hit-1_[cut_0sec]%20(1).mp3')
  );
  const paddleHitSound = useRef(
    new Audio('https://dl.sndup.net/7vg3z/paddle-hit-1_[cut_0sec].mp3')
  );

  const ballRef = useRef({
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    radius: 8,
  });
  const paddle1Ref = useRef({
    x: 10,
    y: canvasHeight / 2 - pH / 2,
    w: pW,
    h: pH,
    dy: 0,
  });
  const paddle2Ref = useRef({
    x: canvasWidth - 10 - pW,
    y: canvasHeight / 2 - pH / 2,
    w: pW,
    h: pH,
    dy: 0,
  });

  useEffect(() => {
    hitWallSound.current.preload = 'auto';
    hitWallSound.current.load(); // Preloads the audio into the browser's memory
    paddleHitSound.current.preload = 'auto';
    paddleHitSound.current.load();
  }, [sound]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setGameState(null);
      const token = await getToken();
      if (!token) {
        console.log(`No valid token: ${token}`);
        return;
      }
      let gameSocket: WebSocket | null = null;
      const wsUrl = `${getWebSocketUrl(`${game_address}/`)}?token=${token}`;
      if (!ws.current) gameSocket = new WebSocket(wsUrl);
      if (!gameSocket) return;
      ws.current = gameSocket;

      gameSocket.onopen = (e) => {
        console.log('WebSocket connected');
        setGameState('waiting');

        // Send the canvas dimensions
        // const message = {
        //   type: 'CONNECT',
        //   canvasWidth: canvasWidth,
        //   canvasHeight: canvasHeight,
        // };
        // gameSocket.send(JSON.stringify(message));
      };

      gameSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        // console.log(data);
        if (data.type === 'game_started') {
          // setTimeout(() => {
          //   // init_game_state(data);
          // }, 100);
          paddle1Ref.current.x = data.state[`player1_paddle_x`];
          paddle2Ref.current.x = data.state[`player2_paddle_x`];
          setGameState('started');
        }
        if (data.type === 'game_update') {
          ballRef.current.x = data.state.ball.x;
          ballRef.current.y = data.state.ball.y;
          paddle1Ref.current.y = data.state[`player1_paddle_y`];
          paddle2Ref.current.y = data.state[`player2_paddle_y`];
        }
        if (data.type === 'play_sound') {
          if (data.collision === 'wall') {
            if (hitWallSound.current) sound && hitWallSound.current.play();
          } else if (data.collision === 'paddle') {
            if (paddleHitSound.current) sound && paddleHitSound.current.play();
          }
        }
        if (data.type === 'score_update') {
          setScore1(data.state[`player1_score`]);
          setScore2(data.state[`player2_score`]);
          if (data.state.game_over) {
            setIsWinner(data.state.is_winner);
            setIsGameOver(true);
            setCurrentScreen('end');
            gameSocket.close();
            ws.current = null;
          }
        }
      };

      gameSocket.onclose = (e) => {
        console.log('Game WebSocket Disconnected');
        // setGameState('ended');
      };
    }, 500);

    return () => {
      if (ws.current) {
        console.log('Closing game websocket ....');
        ws.current.close();
      }
      clearTimeout(timeout);
    };
  }, [restart]);

  useEffect(() => {
    if (isGameOver || gameState != 'started') return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const drawDashedLine = () => {
      ctx.setLineDash([15, 7.1]); // [dash length, gap length]
      ctx.strokeStyle = '#f8f3e3';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 10);
      ctx.lineTo(canvas.width / 2, canvas.height - 10);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const keysPressed: boolean[] = [false];
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'w' || event.key === 'W') keysPressed[0] = true;
      if (event.key === 's' || event.key === 'S') keysPressed[1] = true;
      // if (event.key === 'w' || event.key === 's') {
      //   const direction = event.key === 'w' ? 'up' : 'down';
      //   console.log('moving...');

      //   ws.current?.send(JSON.stringify({ type: 'keydown', direction }));
      // }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (
        event.key === 'w' ||
        event.key === 's' ||
        event.key === 'W' ||
        event.key === 'S'
      ) {
        keysPressed[0] = false;
        keysPressed[1] = false;
      }
      // if (event.key === 'w' || event.key === 's') {
      //   ws.current?.send(JSON.stringify({ type: 'keyup' }));
      // }
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
      drawDashedLine();
      const ball = ballRef.current;
      const paddle1 = paddle1Ref.current;
      const paddle2 = paddle2Ref.current;
      // Draw Bal
      ctx.fillStyle = '#f8f3e3';
      ctx.fillRect(
        ball.x - ball.radius,
        ball.y - ball.radius,
        ball.radius * 2,
        ball.radius * 2
      );
      // Draw Paddle 1
      ctx.fillStyle = 'white';
      ctx.fillRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);

      // Draw Paddle 2
      ctx.fillStyle = 'white';
      ctx.fillRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);
    };

    const update = () => {
      if (
        ws.current &&
        ws.current.readyState === WebSocket.OPEN &&
        keysPressed[0]
      )
        ws.current.send(JSON.stringify({ type: 'keydown', direction: 'up' }));
      if (
        ws.current &&
        ws.current.readyState === WebSocket.OPEN &&
        keysPressed[1]
      )
        ws.current.send(JSON.stringify({ type: 'keydown', direction: 'down' }));
    };

    let animationFrameId: number;
    const animate = () => {
      if (isGameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      update();

      draw(ctx);

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('keydown', (e) => handleKeyDown(e));
    window.addEventListener('keyup', (e) => handleKeyUp(e));
    animate();

    return () => {
      window.removeEventListener('keydown', (e) => handleKeyDown(e));
      window.removeEventListener('keyup', (e) => handleKeyUp(e));
    };
  }, [isGameOver, gameState]);


  const handleRetry = () => {
    requestRemoteGame()
    setGameState(null);
    setIsGameOver(false);
    setRestart((s) => !s);
  };
  const handleMainMenu = () => {
    setState('')
    // setCurrentScreen('mode');
    // setIsGameOver(false);
  };

  if (!gameState || gameState != 'started') {
    return (
      <div className={css.matchmakingLoaderWrapper}>
        <ArcadeLoader className={css.matchmakingLoader} />
      </div>
    );
  }

  return (
    <div className={css.container}>
      {/* {!gameState && <h1>Remote Play - connecting to websocket!</h1>} */}
      {/* {gameState === 'disconnected' && (
        <div>
          <h1>Remote Play - disconnected!</h1>
          <button onClick={() => setRestart((s) => !s)}>Play Again</button>
        </div>
      )}
      {gameState === 'waiting' && <h1>Remote Play - waiting!</h1>} */}
      {gameState === 'started' && (
        <div className={css.gameArea}>
          {currentScreen === 'game' && (
            <div id="gameScreen" className={css.gameScreenDiv}>
              <div className={css.scoreWrapper}>
                <div className={css.player1Score}>{score1}</div>
                <div className={css.player2Score}>{score2}</div>
              </div>
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
              secondAction={'Go Back'}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RemoteGame;
