import React, { useEffect, useRef, useState } from 'react';
import { GameScreens, GameState } from '../../../types/types';
import css from './MultipleGame.module.css';
import EndGameScreen from '../components/EndGameScreen/EndGameScreen';
import getWebSocketUrl from '../../../utils/getWebSocketUrl';
import PlayerCard from './PlayerCard';
import PlayerCardSkeleton from './PlayerCardSkeleton';


const canvasWidth = 480;
const canvasHeight = 480;
const pW = 15;
const pH = 70;
const cornerSize = 10;

interface GameProps { game_address: string;
                     requestMultipleGame?:() => void;
                    onReturn: (()=>void);
                    isMatchTournament?: boolean;
                  }

const MultipleGame: React.FC<GameProps> = ({ game_address,requestMultipleGame=()=>{}, onReturn, isMatchTournament = false}) => {
  const ws = useRef<WebSocket | null>(null);
  const [gameState, setGameState] = useState<GameState>('started');
  const [restart, setRestart] = useState(false);
  // const [player, setPlayer] = useState<string>('');

  const [currentScreen, setCurrentScreen] = useState<GameScreens>('game');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [sound, SwitchSound] = useState(true);
  // const [count, setCount] = useState(3);

  // console.log('MultipleGame component rerendered', `stat: ${gameState}`);

  //pong
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score1, setScore1] = useState([0, 0]);
  const [score2, setScore2] = useState([0, 0]);
  const [score3, setScore3] = useState([0, 0]);
  const [score4, setScore4] = useState([0, 0]);
  const [player1_id, setPlayer1_id] = useState<number | null>(null);
  const [player2_id, setPlayer2_id] = useState<number | null>(null);
  const [player3_id, setPlayer3_id] = useState<number | null>(null);
  const [player4_id, setPlayer4_id] = useState<number | null>(null);

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
    x: 10,
    y: canvasHeight / 2 - pH / 2,
    w: pW,
    h: pH,
    dy: 0,
  });
  const paddle2Ref = useRef({
    x: canvasWidth / 2 - pH / 2,
    y: 10,
    w: pH,
    h: pW,
    dy: 0,
  });
  const paddle3Ref = useRef({
    x: canvasWidth - pW - 10,
    y: canvasHeight / 2 - pH / 2,
    w: pW,
    h: pH,
    dy: 0,
  });
  const paddle4Ref = useRef({
    x: canvasWidth / 2 - pH / 2,
    y: canvasHeight - pW - 10,
    w: pH,
    h: pW,
    dy: 0,
  });

  useEffect(() => {
    SwitchSound(true)

    hitWallSound.current.preload = 'auto';
    hitWallSound.current.load(); // Preload the audio into the browser's memory
    paddleHitSound.current.preload = 'auto';
    paddleHitSound.current.load();
  }, []);




  useEffect(() => {
    const timeout = setTimeout(() => {
      setGameState(null);
      let gameSocket: WebSocket | null = null;
      const wsUrl = `${getWebSocketUrl(`${game_address}/`)}`;
      if (!ws.current) gameSocket = new WebSocket(wsUrl);
      if (!gameSocket) return;
      ws.current = gameSocket;

      gameSocket.onopen = () => {
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
          setPlayer1_id(data.state[`player1_id`])
          setPlayer2_id(data.state[`player2_id`])
          setPlayer3_id(data.state[`player3_id`])
          setPlayer4_id(data.state[`player4_id`])
          setGameState('started');
        }
        if (data.type === 'player_lost') {
          // console.log(data);
          lost.current[0] = data.state[`player1_lost`]
          lost.current[1] = data.state[`player2_lost`]
          lost.current[2] = data.state[`player3_lost`]
          lost.current[3] = data.state[`player4_lost`]
        }
        // if (data.type === 'player_id') {
        //   // console.log(data);
        //   setPlayer(data.player)
        // }
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
          // console.log(data);
          setScore1([data.state[`player1_score`][0], data.state[`player1_score`][1]]);
          setScore2([data.state[`player2_score`][0], data.state[`player2_score`][1]]);
          setScore3([data.state[`player3_score`][0], data.state[`player3_score`][1]]);
          setScore4([data.state[`player4_score`][0], data.state[`player4_score`][1]]);
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

    // const drawDashedLine = () => {
    //   ctx.setLineDash([15, 7.1]); // [dash length, gap length]
    //   ctx.strokeStyle = '#f8f3e3';
    //   ctx.lineWidth = 3;

    //   ctx.beginPath();
    //   ctx.moveTo(canvas.width / 2, 10);
    //   ctx.lineTo(canvas.width / 2, canvas.height - 10);
    //   ctx.stroke();
    //   ctx.setLineDash([]);
    // };

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

  // useEffect(() => {
  //   // if (gameState === 'started') return;

  //   if (count > 0) {
  //     const timer = setTimeout(() => {
  //       setCount((c) => c - 1);
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [count]);

  return (
    <div className={css.container}>
      {/* <div className="relative w-[750px]"> */}
        {/* Top Score */}

        {player1_id ? <PlayerCard layout='horizontal' score={score2[0]} against={score2[1]} p_id={player2_id}/>
            : <PlayerCardSkeleton layout='horizontal'/>}

        <div className="flex items-center justify-center gap-4">
          {/* Left Score */}
          {player1_id ? <PlayerCard score={score1[0]} against={score1[1]} p_id={player1_id}/>
            : <PlayerCardSkeleton />}



          {/* Game Area */}
          {gameState === 'started' || gameState === 'ended' ? (
            <div
              className="flex justify-center items-center relative min-w-[480px] min-h-[480px] max-w-[480px] max-h-[480px] w-[480px] h-[480px] bg-[var(--main-surface-tertiary)] border-[6px] border-[var(--text-color)]"
              style={{
                boxSizing: 'content-box',
                userSelect: 'none',
                touchAction: 'manipulation'
              }}
            >
              {currentScreen === 'game' && (
              <div id="gameScreen" className={css.gameScreenDiv}>
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
              <div
                className="relative flex items-center justify-center min-w-[480px] min-h-[480px] max-w-[480px] max-h-[480px] w-[480px] h-[480px] bg-[var(--main-surface-tertiary)] border-[6px] border-[var(--text-color)]"
                style={{
                  boxSizing: 'content-box',
                  userSelect: 'none',
                  touchAction: 'manipulation'
                }}
              >
              <div className="relative flex items-center justify-center">
                  {/* <div
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
                  </div> */}
                  <div className="animate-pulse text-center">
                    <p className="text-gray-400">Waiting for players to join...</p>
                  </div>
              </div>
            </div>

          )}

          {/* Right Score */}

          {player1_id ? <PlayerCard score={score3[0]} against={score3[1]} p_id={player3_id}/>
            : <PlayerCardSkeleton />}
        </div>

        {/* Bottom Score */}

         {player1_id ? <PlayerCard layout='horizontal' score={score4[0]} against={score4[1]} p_id={player4_id}/>
            : <PlayerCardSkeleton layout='horizontal'/>}
      </div>
    // </div>
  );



};

export default MultipleGame;
