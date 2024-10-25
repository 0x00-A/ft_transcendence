import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import css from './Tournament.module.css';
import Paddle from '../components/utils/Paddle';
import Ball from '../components/utils/Ball';
import {
  isCollidingWithPaddle,
  handlePaddleCollision,
} from '../components/utils/GameLogic';

const initialAngle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
const ballRaduis = 8;
const pW = 20;
const pH = 80;

interface GameProps {
  sound?: boolean;
  paddleSpeed?: number;
  ballSpeed?: number;
  winningScore?: number;
  roundIndex: number;
  matchIndex: number;
  updateWinner: (
    roundIndex: number,
    matchIndex: number,
    newWinner: number
  ) => void;
  player1?: string;
  player2?: string;
}

const Pong: React.FC<GameProps> = ({
  roundIndex,
  matchIndex,
  updateWinner,
  sound = true,
  paddleSpeed = 2,
  ballSpeed = 1.5,
  winningScore = 3,
  player1 = 'player 1',
  player2 = 'player 2',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const ballRef = useRef<Ball | null>(null);
  const paddle1Ref = useRef<Paddle | null>(null);
  const paddle2Ref = useRef<Paddle | null>(null);
  const hitWallSound = useRef(
    new Audio('https://dl.sndup.net/ckxyx/wall-hit-1_[cut_0sec]%20(1).mp3')
  );
  const paddleHitSound = useRef(
    new Audio('https://dl.sndup.net/7vg3z/paddle-hit-1_[cut_0sec].mp3')
  );

  useEffect(() => {
    ballRef.current = new Ball(
      canvasRef.current!.width / 2,
      canvasRef.current!.height / 2,
      ballRaduis,
      ballSpeed,
      initialAngle
    );

    paddle1Ref.current = new Paddle(
      10,
      canvasRef.current!.height / 2 - pH / 2,
      pW,
      pH,
      paddleSpeed
    );
    paddle2Ref.current = new Paddle(
      canvasRef.current!.width - 10 - pW,
      canvasRef.current!.height / 2 - pH / 2,
      pW,
      pH,
      paddleSpeed
    );
  }, []);

  useEffect(() => {
    hitWallSound.current.preload = 'auto';
    hitWallSound.current.load(); // Preloads the audio into the browser's memory
    paddleHitSound.current.preload = 'auto';
    paddleHitSound.current.load();
  }, [sound]);

  useEffect(() => {
    if (isGameOver) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const ball: Ball | null = ballRef.current;
    const paddle1: Paddle | null = paddle1Ref.current;
    const paddle2: Paddle | null = paddle2Ref.current;
    if (!ball || !paddle1 || !paddle2) return;

    const resetBall = () => {
      ball.x = ball.dx > 0 ? 3 * (canvas.width / 4) : canvas.width / 4;
      ball.y = canvas.height / 2;
      ball.angle = (Math.random() * Math.PI) / 2 - Math.PI / 4;
      ball.speed = ballSpeed;
      const serveDirection = ball.dx > 0 ? -1 : 1;
      ball.dx = serveDirection * ballSpeed * Math.cos(ball.angle);
      ball.dy = ballSpeed * Math.sin(ball.angle);
    };

    const updateScore = (player: number) => {
      // left and right collision
      // ball.dx *= -1;
      // player === 1 ? setScore1((s) => s + 1) : setScore2((s) => s + 1);
      // if (score1 + 1 >= winningScore || score2 + 1 >= winningScore) {
      //   setIsGameOver(true);
      //   // isPlayer1 ? setIsWinner(true) : setIsWinner(false);
      //   updateWinner(roundIndex, matchIndex, player === 1 ? 1 : 2);
      // }
      if (player === 1) {
        setScore1((prevScore) => prevScore + 1);
        if (score1 + 1 >= winningScore) {
          setIsGameOver(true);
          updateWinner(roundIndex, matchIndex, 1);
        }
      } else {
        setScore2((prevScore) => prevScore + 1);
        if (score2 + 1 >= winningScore) {
          setIsGameOver(true);
          updateWinner(roundIndex, matchIndex, 2);
        }
      }
      resetBall();
    };

    const checkCollision = () => {
      // next move top and bottom collision
      let newX = ball.x + ball.dx + (ball.dx > 0 ? ball.radius : -ball.radius);
      let newY = ball.y + ball.dy + (ball.dy > 0 ? ball.radius : -ball.radius);

      // reverse the ball direction
      if (newY >= canvas.height || newY <= 0) {
        if (hitWallSound.current.paused) sound && hitWallSound.current.play();

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

        if (paddleHitSound.current.paused)
          sound && paddleHitSound.current.play();
        handlePaddleCollision(ball, paddle1);
      } else if (isCollidingWithPaddle(ball, paddle2)) {
        if (paddleHitSound.current.paused)
          sound && paddleHitSound.current.play();
        handlePaddleCollision(ball, paddle2);
      } else if (newX >= canvas.width) {
        updateScore(1);
      } else if (newX <= 0) {
        updateScore(2);
      }
    };

    const drawDashedLine = () => {
      ctx.setLineDash([15, 7.1]); // [dash length, gap length]
      ctx.strokeStyle = '#f8f3e3';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 10); // Start at the top of the canvas
      ctx.lineTo(canvas.width / 2, canvas.height - 10); // Draw to the bottom of the canvas
      ctx.stroke();
      ctx.setLineDash([]); // Reset the line dash to solid for other drawings
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') paddle1.dy = -paddle1.speed;
      if (e.key === 's' || e.key === 'S') paddle1.dy = paddle1.speed;
      if (e.key === 'ArrowUp') paddle2.dy = -paddle2.speed;
      if (e.key === 'ArrowDown') paddle2.dy = paddle2.speed;
      if (e.key === ' ') togglePause();
      console.log(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 's' || e.key === 'W' || e.key === 'S')
        paddle1.dy = 0;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') paddle2.dy = 0;
    };

    const drawBall = () => {
      ctx.beginPath();
      // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#f8f3e3';
      // ctx.fill();
      ctx.fillRect(
        ball.x - ball.radius,
        ball.y - ball.radius,
        ball.radius * 2,
        ball.radius * 2
      );
      ctx.closePath();
    };

    const drawPaddle = (paddle: Paddle) => {
      ctx.fillStyle = 'white';
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    };

    const movePaddle = (paddle: Paddle) => {
      // Update the y position by the current dy value
      paddle.y += paddle.dy;

      // Prevent the paddle from going off the canvas
      if (paddle.y < 0) {
        paddle.y = 0;
      } else if (paddle.y + paddle.height > ctx.canvas.height) {
        paddle.y = ctx.canvas.height - paddle.height;
      }
    };

    let animationFrameId: number;
    const animate = () => {
      if (isGameOver) return;
      if (!paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawDashedLine();
        checkCollision();
        if (gameStarted) ball.move();
        movePaddle(paddle1);
        movePaddle(paddle2);
        drawBall();
        drawPaddle(paddle1);
        drawPaddle(paddle2);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('keydown', (e) => handleKeyDown(e));
    window.addEventListener('keyup', (e) => handleKeyUp(e));
    // window.addEventListener('keypress', (e) => handleKeyPress(e));

    animate();

    return () => {
      window.removeEventListener('keydown', (e) => handleKeyDown(e));
      window.removeEventListener('keyup', (e) => handleKeyUp(e));
      cancelAnimationFrame(animationFrameId);
    };
  }, [isGameOver, score1, score2, paused, gameStarted]);

  const togglePause = () => {
    setPaused(!paused);
    console.log('pause', paused);
  };

  const startCountdown = () => {
    setCountdown(3); // Start countdown at 3
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000); // Decrement every second
    } else if (countdown === 0) {
      setCountdown(null); // Remove countdown when it finishes
      setGameStarted(true); // Start the game
    }
    return () => clearTimeout(timer); // Clean up the timer
  }, [countdown]);

  return (
    <div id="gameScreen" className={css.gameScreenDiv}>
      <div className={css.playerNamesWrapper}>
        <div className={css.player1}>{player1}</div>
        <div className={css.player2}>{player2}</div>
      </div>
      {/* {paused && <div id="pauseDiv">Paused, press P to continue</div>} */}
      <div className={css.canvasDiv}>
        <div className={css.scoreWrapper}>
          <div className={css.player1Score}>{score1}</div>
          <div className={css.player2Score}>{score2}</div>
        </div>
        {!gameStarted && countdown === null && (
          <div className={css.gameOverlay} onClick={startCountdown}>
            <div className={css.gameOverlayContent}>
              <h2>Click to Start</h2>
            </div>
          </div>
        )}
        {countdown !== null && (
          <div className={css.gameOverlay}>
            <div className={css.gameOverlayContent}>
              <h2>{countdown > 0 ? countdown : 'Start!'}</h2>
            </div>
          </div>
        )}
        <canvas width="650" height="480" id={css.gameCanvas} ref={canvasRef} />
      </div>
      {gameStarted && (
        <button className={css.pauseButton} onClick={togglePause}>
          {paused ? 'Resume' : 'Pause'}
        </button>
      )}
    </div>
  );
};

function IconLabelButtons({ onClick }: { onClick: () => void }) {
  return (
    // <Stack className={`${css.playButton}`} direction="row" spacing={2}>
    //   <Button
    //     onClick={onClick}
    //     className={css.button}
    //     variant="outlined"
    //     startIcon={<IoMdArrowRoundForward />}
    //   ></Button>
    // </Stack>
    <button onClick={onClick} className={`${css.playButton}`}>
      Go
    </button>
  );
}

function Round({ children }: PropsWithChildren) {
  return (
    <div className={css.round}>
      <p className={css.roundLabel}>{children}</p>
    </div>
  );
}

const Match = ({
  matchNumber,
  player1,
  player2,
  winner,
  activeMatch,
  onClick,
}: {
  matchNumber: Number;
  player1: string;
  player2: string;
  winner: Number;
  activeMatch: Number;
  onClick: () => void;
}) => {
  return (
    <div className={css.matchup}>
      <div className={css.participants}>
        <div className={`${css.participant} ${winner === 1 ? css.winner : ''}`}>
          <span>{player1}</span>
        </div>
        <div className={`${css.participant} ${winner === 2 ? css.winner : ''}`}>
          <span>{player2}</span>
        </div>
      </div>
      {matchNumber === activeMatch && <IconLabelButtons onClick={onClick} />}
      <div></div>
    </div>
  );
};

const Connector = () => {
  return (
    <div className={css.connector}>
      <div className={css.merger}></div>
      <div className={css.line}></div>
    </div>
  );
};

type FormProps = {
  onSubmit: (players: string[]) => void;
  players: string[];
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>;
};

const PlayerForm = ({ onSubmit, players, setPlayers }: FormProps) => {
  const handleInputChange = (index: number, value: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = value;
    setPlayers(updatedPlayers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(players);
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <h2 className={css.title}>Enter Players</h2>
      {players.map((player, index) => (
        <div key={index} className={css.inputContainer}>
          <label className={css.label}>
            Player {index + 1}:
            <input
              type="text"
              value={player}
              maxLength={20}
              onChange={(e) => handleInputChange(index, e.target.value)}
              required
              className={css.input}
            />
          </label>
        </div>
      ))}
      <button type="submit" className={css.button}>
        Start Tournament
      </button>
    </form>
  );
};

type Match = {
  player1: string;
  player2: string;
  winner: number; // Could be a number indicating the winner (like player1 or player2) or you could use `string` if it's a player name.
};

type Rounds = {
  [key: number]: Match[];
};

const WinnerCard = ({ winner }: { winner: string }) => {
  return (
    <div className={css.winnerCard}>
      <div className={`${css.gradientLine} ${css.Gold}`}></div>
      <div className={css.body}>
        <div className={css.rank}>
          <img
            className={css.icon}
            src="/icon-medal-first.svg"
            alt="Icon medal first"
          />
          <p>{winner} 🎉🎉🎉</p>
        </div>
      </div>
    </div>
  );
};

// const TournamentForm = ({ onSubmit, players, setPlayers }: FormProps) => {
//   // const [players, setPlayers] = useState<string[]>([]);
//   const [playerName, setPlayerName] = useState<string>('');

//   const handleAddPlayer = () => {
//     if (playerName && players.length < 8) {
//       setPlayers([...players, playerName]);
//       setPlayerName(''); // Clear input after adding
//     }
//   };

//   const handleRemovePlayer = (index: number) => {
//     const updatedPlayers = players.filter((_, i) => i !== index);
//     setPlayers(updatedPlayers);
//   };

//   // const handleStartTournament = () => {
//   //   if (players.length === 8) {
//   //     alert('Tournament Started!');
//   //     // Logic for starting the tournament goes here
//   //   }
//   // };
//   const handleStartTournament = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (players.length === 8) onSubmit(players);
//   };

//   return (
//     <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
//       <h2>Tournament Registration</h2>

//       <input
//         type="text"
//         value={playerName}
//         onChange={(e) => setPlayerName(e.target.value)}
//         placeholder="Enter player name"
//         style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
//       />

//       <button
//         onClick={handleAddPlayer}
//         disabled={!playerName || players.length >= 8}
//         style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
//       >
//         Add Player
//       </button>

//       <ul>
//         {players.map((player, index) => (
//           <li
//             key={index}
//             style={{
//               marginBottom: '10px',
//               display: 'flex',
//               justifyContent: 'space-between',
//             }}
//           >
//             {player}
//             <button
//               onClick={() => handleRemovePlayer(index)}
//               style={{
//                 color: 'white',
//                 backgroundColor: 'red',
//                 border: 'none',
//                 cursor: 'pointer',
//                 padding: '5px',
//               }}
//             >
//               &#x2716; {/* Cross icon */}
//             </button>
//           </li>
//         ))}
//       </ul>

//       <button
//         onClick={handleStartTournament}
//         disabled={players.length !== 8}
//         style={{
//           marginTop: '20px',
//           width: '100%',
//           padding: '10px',
//           backgroundColor: players.length === 8 ? 'green' : 'grey',
//           color: 'white',
//           cursor: players.length === 8 ? 'pointer' : 'not-allowed',
//         }}
//       >
//         Start Tournament
//       </button>
//     </div>
//   );
// };

const TournamentForm = ({ onSubmit, players, setPlayers }: FormProps) => {
  // const [players, setPlayers] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [error, setError] = useState<string>(''); // To store error messages

  const handleAddPlayer = () => {
    // Check for empty input
    if (!playerName.trim()) {
      setError('Player name cannot be empty');
      return;
    }

    // Check for duplicate player names
    if (players.includes(playerName)) {
      setError('Player name must be unique');
      return;
    }

    // Add player if there are fewer than 8 players and the name is unique
    if (players.length < 8) {
      setPlayers([...players, playerName.trim()]);
      setPlayerName(''); // Clear input after adding
      setError(''); // Clear any previous error
    }
  };

  const handleRemovePlayer = (index: number) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
  };

  const handleStartTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (players.length === 8) onSubmit(players);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Tournament Registration</h2>

      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
        maxLength={15}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <button
        onClick={handleAddPlayer}
        disabled={!playerName || players.length >= 8}
        style={{ marginBottom: '10px', width: '100%', padding: '10px' }}
      >
        Add Player
      </button>

      {/* Display error message for duplicate names */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {players.map((player, index) => (
          <li
            key={index}
            style={{
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {player}
            <button
              onClick={() => handleRemovePlayer(index)}
              style={{
                color: 'white',
                backgroundColor: 'red',
                border: 'none',
                cursor: 'pointer',
                padding: '5px',
              }}
            >
              &#x2716; {/* Cross icon */}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleStartTournament}
        disabled={players.length !== 8}
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '10px',
          backgroundColor: players.length === 8 ? 'green' : 'grey',
          color: 'white',
          cursor: players.length === 8 ? 'pointer' : 'not-allowed',
        }}
      >
        Start Tournament
      </button>
    </div>
  );
};

const Tournament = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [activeMatch, setActiveMatch] = useState(1);
  const [showForm, setShowForm] = useState(true);
  const [showPong, setShowPong] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [selectedRound, setSelectedRound] = useState<number>(0);
  const [selectedMatch, setSelectedMatch] = useState<number>(0);
  const [rounds, setRounds] = useState<Rounds>({
    0: [
      { player1: '', player2: '', winner: 0 },
      { player1: '', player2: '', winner: 0 },
      { player1: '', player2: '', winner: 0 },
      { player1: '', player2: '', winner: 0 },
    ],
    1: [
      { player1: '', player2: '', winner: 0 },
      { player1: '', player2: '', winner: 0 },
    ],
    2: [{ player1: '', player2: '', winner: 0 }],
  });

  //   const updateWinner = (
  //     roundIndex: number,
  //     matchIndex: number,
  //     newWinner: number
  //   ) => {
  //     setRounds((prevRounds) => ({
  //       ...prevRounds,
  //       [roundIndex]: prevRounds[roundIndex].map((match, idx) =>
  //         idx === matchIndex ? { ...match, winner: newWinner } : match
  //       ),
  //     }));
  //     setActiveMatch((curr) => curr + 1);
  //     setShowPong(false);
  //   };

  const updateWinner = (
    roundIndex: number,
    matchIndex: number,
    newWinner: number
  ) => {
    setRounds((prevRounds) => {
      const updatedRounds = { ...prevRounds };

      // Update the current match winner
      const match = updatedRounds[roundIndex][matchIndex];
      match.winner = newWinner;

      if (roundIndex === 0) {
        // This is the quarterfinals, so we need to update the semifinals (roundIndex 1)

        // Find which player won the current match
        const winnerName = newWinner === 1 ? match.player1 : match.player2;

        // Determine which semifinal match to update based on the quarterfinal match index
        const semifinalMatchIndex = Math.floor(matchIndex / 2);
        const isFirstInPair = matchIndex % 2 === 0;

        // Update the player in the corresponding semifinal match
        if (isFirstInPair) {
          updatedRounds[1][semifinalMatchIndex].player1 = winnerName;
        } else {
          updatedRounds[1][semifinalMatchIndex].player2 = winnerName;
        }
      }
      if (roundIndex === 1) {
        const winnerName = newWinner === 1 ? match.player1 : match.player2;

        if (matchIndex === 0) {
          updatedRounds[2][0].player1 = winnerName;
        } else {
          updatedRounds[2][0].player2 = winnerName;
        }
      }

      return updatedRounds;
    });
    setActiveMatch((curr) => curr + 1);
    setShowPong(false);
    if (activeMatch === 7) setShowWinner(true);
  };

  const playMatch = (roundIndex: number, matchIndex: number) => {
    setSelectedRound(roundIndex);
    setSelectedMatch(matchIndex);
    setShowPong(true);
  };

  const handleSubmit = () => {
    console.log(players);

    setPlayers((players) => [...players].sort(() => Math.random() - 0.5));
    setRounds((prevRounds) => {
      let newRounds = { ...prevRounds };
      newRounds[0] = [
        { player1: players[0], player2: players[4], winner: 0 },
        { player1: players[1], player2: players[5], winner: 0 },
        { player1: players[2], player2: players[6], winner: 0 },
        { player1: players[3], player2: players[7], winner: 0 },
      ];
      return newRounds;
    });
    setShowForm(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Check if the click is outside the overlay content
    if ((e.target as HTMLElement).classList.contains(css.overlay)) {
      setShowWinner(false); // Close the overlay
    }
  };

  return (
    <div className={css.container}>
      {showForm && (
        <TournamentForm
          onSubmit={handleSubmit}
          players={players}
          setPlayers={setPlayers}
        />
      )}
      {!showForm && showPong ? (
        <Pong
          roundIndex={selectedRound}
          matchIndex={selectedMatch}
          updateWinner={updateWinner}
          player1={rounds[selectedRound][selectedMatch].player1}
          player2={rounds[selectedRound][selectedMatch].player2}
        />
      ) : (
        !showForm && (
          <div className={css.tournamentBody}>
            <div className={css.rounds}>
              <Round>Round 1</Round>
              <Round>Semifinals</Round>
              <Round>Finals</Round>
            </div>
            <div className={css.bracket}>
              <section className={`${css.round} ${css.quarterfinals}`}>
                <div className={css.winners}>
                  <div className={css.matchups}>
                    <Match
                      matchNumber={1}
                      player1={rounds[0][0].player1}
                      player2={rounds[0][0].player2}
                      winner={rounds[0][0].winner}
                      activeMatch={activeMatch}
                      onClick={() => playMatch(0, 0)}
                    />
                    <Match
                      matchNumber={2}
                      player1={rounds[0][1].player1}
                      player2={rounds[0][1].player2}
                      winner={rounds[0][1].winner}
                      activeMatch={activeMatch}
                      onClick={() => playMatch(0, 1)}
                    />
                  </div>
                  <Connector />
                </div>

                <div className={css.winners}>
                  <div className={css.matchups}>
                    <Match
                      matchNumber={3}
                      player1={rounds[0][2].player1}
                      player2={rounds[0][2].player2}
                      winner={rounds[0][2].winner}
                      activeMatch={activeMatch}
                      onClick={() => playMatch(0, 2)}
                    />
                    <Match
                      matchNumber={4}
                      player1={rounds[0][3].player1}
                      player2={rounds[0][3].player2}
                      winner={rounds[0][3].winner}
                      activeMatch={activeMatch}
                      onClick={() => playMatch(0, 3)}
                    />
                  </div>
                  <Connector />
                </div>
              </section>

              <section className={`${css.round} ${css.semifinals}`}>
                <div className={css.winners}>
                  <div className={css.matchups}>
                    <Match
                      matchNumber={5}
                      player1={rounds[1][0].player1}
                      player2={rounds[1][0].player2}
                      winner={rounds[1][0].winner}
                      activeMatch={activeMatch}
                      onClick={() => playMatch(1, 0)}
                    />
                    <Match
                      matchNumber={6}
                      player1={rounds[1][1].player1}
                      player2={rounds[1][1].player2}
                      winner={rounds[1][1].winner}
                      activeMatch={activeMatch}
                      onClick={() => playMatch(1, 1)}
                    />
                  </div>
                  <Connector />
                </div>
              </section>

              <section className={`${css.round} ${css.finals}`}>
                <div className={css.winners}>
                  <div className={css.matchups}>
                    <Match
                      matchNumber={7}
                      player1={rounds[2][0].player1}
                      player2={rounds[2][0].player2}
                      winner={rounds[2][0].winner}
                      activeMatch={activeMatch}
                      onClick={() => playMatch(2, 0)}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        )
      )}
      {showWinner && (
        <div className={css.overlay} onClick={handleOverlayClick}>
          <div className={css.overlayContent}>
            <WinnerCard
              winner={
                rounds[2][0].winner === 1
                  ? rounds[2][0].player1
                  : rounds[2][0].player2
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tournament;
