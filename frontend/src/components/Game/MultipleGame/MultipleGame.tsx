import React, { useEffect, useRef, useState } from 'react';
import { GameScreens, GameState } from '../../../types/types';
import css from './MultipleGame.module.css';
import EndGameScreen from '../components/EndGameScreen/EndGameScreen';
import getWebSocketUrl from '../../../utils/getWebSocketUrl';
import ArcadeLoader from '../components/ArcadeLoader/ArcadeLoader';
import ReturnBack from '../components/ReturnBack/ReturnBack';
import { useGameInvite } from '@/contexts/GameInviteContext';
import MatchmakingScreen from '@/pages/Game/MatchmakingScreen/MatchmakingScreen';
import { Crosshair, Zap, Gamepad2, RadarIcon } from 'lucide-react';


const canvasWidth = 600;
const canvasHeight = 600;
const pW = 20;
const pH = 80;
const cornerSize = 20;

interface GameProps { game_address: string;
                     requestMultipleGame?:() => void;
                    onReturn: (()=>void);
                    isMatchTournament?: boolean;
                    p1_id: number;
                    p2_id: number;
                  }

const MultipleGame: React.FC<GameProps> = ({ game_address,requestMultipleGame=()=>{}, onReturn, isMatchTournament = false, p1_id, p2_id }) => {
  const ws = useRef<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState>('started');
  const [restart, setRestart] = useState(false);
  const [player, setPlayer] = useState<string>('');

  const [currentScreen, setCurrentScreen] = useState<GameScreens>('game');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [sound, SwitchSound] = useState(true);
  const [count, setCount] = useState(3);

  console.log('MultipleGame component rerendered', `stat: ${gameState}`);

  //pong
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [score3, setScore3] = useState(0);
  const [score4, setScore4] = useState(0);

  const colors = useRef(Array(4).fill('white'))
  const lost = useRef(Array(4).fill(false))

  const hitWallSound = useRef(
    new Audio('https://dl.sndup.net/ckxyx/wall-hit-1_[cut_0sec]%20(1).mp3')
  );
  const paddleHitSound = useRef(
    new Audio('https://dl.sndup.net/7vg3z/paddle-hit-1_[cut_0sec].mp3')
  );

  const ballRef = useRef({
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    color: 'white',
    radius: 8,
  });
  const paddle1Ref = useRef({
    x: 20,
    y: canvasHeight / 2 - pH / 2,
    w: pW,
    h: pH,
    dy: 0,
  });
  const paddle2Ref = useRef({
    x: canvasWidth / 2 - pH / 2,
    y: 20,
    w: pH,
    h: pW,
    dy: 0,
  });
  const paddle3Ref = useRef({
    x: canvasWidth - 20 - pW,
    y: canvasHeight / 2 - pH / 2,
    w: pW,
    h: pH,
    dy: 0,
  });
  const paddle4Ref = useRef({
    x: canvasWidth / 2 - pH / 2,
    y: canvasHeight - 20 - pW,
    w: pH,
    h: pW,
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
        // console.log(data);

        if (data.type === 'game_started') {

          paddle1Ref.current.x = data.state[`player1_paddle_x`];
          paddle2Ref.current.y = data.state[`player2_paddle_y`];
          paddle3Ref.current.x = data.state[`player3_paddle_x`];
          paddle4Ref.current.y = data.state[`player4_paddle_y`];
          colors.current[0] = data.state[`player1_color`]
          colors.current[1] = data.state[`player2_color`]
          colors.current[2] = data.state[`player3_color`]
          colors.current[3] = data.state[`player4_color`]
          setGameState('started');
        }
        if (data.type === 'player_lost') {
          console.log(data);
          lost.current[0] = data.state[`player1_lost`]
          lost.current[1] = data.state[`player2_lost`]
          lost.current[2] = data.state[`player3_lost`]
          lost.current[3] = data.state[`player4_lost`]
        }
        if (data.type === 'player_id') {
          console.log(data);
          setPlayer(data.player)
        }
        if (data.type === 'game_update') {
          ballRef.current.x = data.state.ball.x;
          ballRef.current.y = data.state.ball.y;
          paddle1Ref.current.y = data.state[`player1_paddle_y`];
          paddle2Ref.current.x = data.state[`player2_paddle_x`];
          paddle3Ref.current.y = data.state[`player3_paddle_y`];
          paddle4Ref.current.x = data.state[`player4_paddle_x`];
          ballRef.current.color = data.state.ball.color;
        }
        if (data.type === 'play_sound') {
          if (data.collision === 'wall') {
            if (hitWallSound.current) sound && hitWallSound.current.play();
          } else if (data.collision === 'paddle') {
            if (paddleHitSound.current) sound && paddleHitSound.current.play();
          }
        }
        if (data.type === 'score_update') {
          console.log(data);
          setScore1(data.state[`player1_score`]);
          setScore2(data.state[`player2_score`]);
          setScore3(data.state[`player3_score`]);
          setScore4(data.state[`player4_score`]);
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
      // drawDashedLine();
      const ball = ballRef.current;
      const paddle1 = paddle1Ref.current;
      const paddle2 = paddle2Ref.current;
      const paddle3 = paddle3Ref.current;
      const paddle4 = paddle4Ref.current;

      // Draw corners
      ctx.fillStyle = '#ffffff';

      // Top-left corner
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(cornerSize, 0);
      ctx.lineTo(0, cornerSize);
      ctx.fill();

      // Top-right corner
      ctx.beginPath();
      ctx.moveTo(canvas.width, 0);
      ctx.lineTo(canvas.width - cornerSize, 0);
      ctx.lineTo(canvas.width, cornerSize);
      ctx.fill();

      // Bottom-left corner
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(cornerSize, canvas.height);
      ctx.lineTo(0, canvas.height - cornerSize);
      ctx.fill();

      // Bottom-right corner
      ctx.beginPath();
      ctx.moveTo(canvas.width, canvas.height);
      ctx.lineTo(canvas.width - cornerSize, canvas.height);
      ctx.lineTo(canvas.width, canvas.height - cornerSize);
      ctx.fill();
      // Draw Bal
      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        2 * Math.PI,
      );
      ctx.fill()
      ctx.closePath()
      // Paddle 1
      if (!lost.current[0]) {
        ctx.fillStyle = colors.current[0];
        ctx.fillRect(paddle1.x, paddle1.y, paddle1.w, paddle1.h);
      }
      // Paddle 2
      if (!lost.current[1]) {
        ctx.fillStyle = colors.current[1];
        ctx.fillRect(paddle2.x, paddle2.y, paddle2.w, paddle2.h);
      }
      // Paddle 3
      if (!lost.current[2]) {
        ctx.fillStyle = colors.current[2];
        ctx.fillRect(paddle3.x, paddle3.y, paddle3.w, paddle3.h);
      }
      // Paddle 4
      if (!lost.current[3]) {
        ctx.fillStyle = colors.current[3];
        ctx.fillRect(paddle4.x, paddle4.y, paddle4.w, paddle4.h);
      }
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
    requestMultipleGame()
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


  const players = [
    { id: 1, name: "Player 1", score: 5, color: "bg-blue-500" },
    { id: 2, name: "Player 2", score: 3, color: "bg-red-500" },
    { id: 3, name: "Player 3", score: 7, color: "bg-green-500" },
    { id: 4, name: "Player 4", score: 4, color: "bg-yellow-500" }
  ];

  return (
    <div className={css.container}>
      <div className="relative w-[750px]"> {/* Container with extra width for side scores */}
        {/* Top Score */}
        <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2">
          <div className={`${players[1].color} px-4 py-1 rounded-lg text-white font-bold`}>
            {'score against'} - {score2}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          {/* Left Score */}
          <div className={`${players[0].color} px-4 py-1 rounded-lg text-white font-bold whitespace-nowrap`}>
            {'score against'} - {score1}
          </div>

          {/* Game Area */}
          <div
            className="min-w-[600px] min-h-[600px] max-w-[600px] max-h-[600px] w-[600px] h-[600px] bg-[var(--main-surface-tertiary)] border-[6px] border-[var(--text-color)]"
            style={{
              boxSizing: 'content-box',
              userSelect: 'none',
              touchAction: 'manipulation'
            }}
          >
            {currentScreen === 'game' && (
              <div id="gameScreen" className={css.gameScreenDiv}>
                {/* <div className={css.scoreWrapper}>
                  <div className={css.player1Score}>{score1}</div>
                  <div className={css.player2Score}>{score2}</div>
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
                isMatchTournament={isMatchTournament}
              />
            )}
          </div>

          {/* Right Score */}
          <div className={`${players[2].color} px-4 py-1 rounded-lg text-white font-bold whitespace-nowrap`}>
            {'score against'} - {score3}
          </div>
        </div>

        {/* Bottom Score */}
        <div className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2">
          <div className={`${players[3].color} px-4 py-1 rounded-lg text-white font-bold`}>
            {'score against'} - {score4}
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <div className={css.container}>

      {/* {!gameState &&
            <RadarIcon
              className="text-red-500 animate-ping absolute m-auto  flex justify-center items-center inset-0 opacity-50"
              size={120}
            />
        } */}
      {/* <PlayerMatchupBanner p1_id={p1_id} p2_id={p2_id} player={player} /> */}
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
      {/* {gameState === 'started' || gameState === 'ended' ? (
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
          </div>
        </div>

      )
      } */}
      <ReturnBack onClick={onReturn} />
    </div>
  );
};

export default MultipleGame;
