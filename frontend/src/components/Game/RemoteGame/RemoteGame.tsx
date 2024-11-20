import React, { useEffect, useRef, useState } from 'react';
import { GameScreens, GameState } from '../../../types/types';
import css from './RemoteGame.module.css';
import EndGameScreen from '../components/EndGameScreen/EndGameScreen';
import getWebSocketUrl from '../../../utils/getWebSocketUrl';
import ArcadeLoader from '../components/ArcadeLoader/ArcadeLoader';
import ReturnBack from '../components/ReturnBack/ReturnBack';
import { useGameInvite } from '@/contexts/GameInviteContext';
import PlayerMatchupBanner from './PlayerMatchupBanner';
import MatchmakingScreen from '@/pages/Game/MatchmakingScreen/MatchmakingScreen';
import { Crosshair, Zap, Gamepad2, RadarIcon } from 'lucide-react';


const canvasWidth = 650;
const canvasHeight = 480;
const pW = 20;
const pH = 80;

interface GameProps { game_address: string;
                     requestRemoteGame?:() => void;
                    onReturn: (()=>void);
                    isMatchTournament?: boolean;
                  }

const RemoteGame: React.FC<GameProps> = ({ game_address,requestRemoteGame=()=>{}, onReturn, isMatchTournament = false }) => {
  const ws = useRef<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState>(null);
  const [restart, setRestart] = useState(false);

  const [currentScreen, setCurrentScreen] = useState<GameScreens>('game');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [sound, SwitchSound] = useState(true);
  const [count, setCount] = useState(3);

  const {setGameAccepted} = useGameInvite();

  console.log('RemoteGame component rerendered', `stat: ${gameState}`);

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
    hitWallSound.current.load(); // Preload the audio into the browser's memory
    paddleHitSound.current.preload = 'auto';
    paddleHitSound.current.load();

    return () => {
      // setGameAccepted(false);
    }
  }, [sound]);




  useEffect(() => {
    const timeout = setTimeout(() => {
      setGameState(null);
      let gameSocket: WebSocket | null = null;
      const wsUrl = `${getWebSocketUrl(`${game_address}/`)}`;
      if (!ws.current) gameSocket = new WebSocket(wsUrl);
      if (!gameSocket) return;
      ws.current = gameSocket;

      gameSocket.onopen = (e) => {
        console.log('Game WebSocket connected');
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
        if (data.type === 'game_started') {

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
            setGameState('ended');
            setCurrentScreen('end');
            gameSocket.close();
            ws.current = null;
            // setGameAccepted(false)
          }
        }
        // if (data.type === 'game_countdown') {
        //   console.log(data);
        //   setCount(data.count)
        // }
      };

      gameSocket.onclose = () => {
        console.log('Game WebSocket Disconnected');
        // setGameState('ended');
        // setCurrentScreen('end');
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
    if (!canvas) return;
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

    const animate = () => {
      if (isGameOver) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      update();

      draw(ctx);

      requestAnimationFrame(animate);
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
    onReturn();
  };

  // if (!gameState) {
  //   return (
  //     <div className={css.matchmakingLoaderWrapper}>
  //       <ArcadeLoader className={css.matchmakingLoader} />
  //     </div>
  //   );
  // }

  useEffect(() => {
    if (gameState === 'started') return;

    if (count > 0) {
      const timer = setTimeout(() => {
        setCount((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);


  return (
    <div className={css.container}>

      {/* {!gameState &&
            <RadarIcon
              className="text-red-500 animate-ping absolute m-auto  flex justify-center items-center inset-0 opacity-50"
              size={120}
            />
        } */}
      <PlayerMatchupBanner />
      {gameState === 'started' || gameState === 'ended' ? (
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
              isMatchTournament={isMatchTournament}
            />
          )}
        </div>
      ) :

      (
        <div className={css.gameArea}>
          <div className="relative flex flex-col items-center">
              <div
                className="text-9xl font-bold mb-8 transition-all duration-500"
                style={{
                  opacity: count === 1 ? 0 : 1,
                  transform: `scale(${count === 1 ? 1.5 : 1})`
                }}
              >
                {count || <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold animate-pulse text-yellow-400">
                    GO!
                  </div>
                </div>}
              </div>
              {/* {count === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold animate-bounce text-yellow-400">
                    GO!
                  </div>
                </div>
              )} */}
          </div>
        </div>

      )
      }
      <ReturnBack onClick={onReturn} />
    </div>
  );
};

export default RemoteGame;
