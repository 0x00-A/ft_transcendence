import { useEffect, useRef, useState } from 'react';
// import GameMode from './components/GameMode/GameMode';
import css from './ModeSelection.module.css';
import GameMode from '../../components/Game/components/GameMode/GameMode';
// import Canvas from './components/Canvas/Canvas';
import { useNavigate } from 'react-router-dom';

const generateUniqueGameId = () => {
  return Math.random().toString(36).substr(2, 9); // Simple unique ID generation
};

const Modes = [
  {
    id: 0,
    title: 'local play',
    description: 'two players on the same keyboard',
  },
  { id: 1, title: 'remote play', description: 'play with a friend remotely' },
  { id: 2, title: 'solo play', description: 'play with AI locally' },
  {
    id: 3,
    title: 'battle royal',
    description: 'remote play with multiple players',
  },
  { id: 4, title: 'tournament', description: 'join or create a tournament' },
];

const ModeSelection = () => {
  const [selectedMode, setSelectedMode] = useState<number | null>(0);
  const [state, setState] = useState('');
  const ws = useRef<WebSocket | null>(null);

  const navigate = useNavigate();

  const startGame = (modeId: number) => {
    const gameId = generateUniqueGameId(); // Generate a unique game ID
    if (modeId === 0) navigate(`/game/local`); // Navigate to the game URL with mode and ID
    if (modeId === 1) navigate(`/game/remote/${gameId}`); // Navigate to the game URL with mode and ID
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const socket = new WebSocket('ws://localhost:8000/ws/matchmaking/');
      ws.current = socket;

      socket.onopen = () => {
        console.log('Socket connected');
        setState('connected');
      };

      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);

        if (data.event === 'in_queue') {
          setState('inqueue');
        }

        if (data.event === 'already_inqueue') {
          console.log('already in queue');
        }
        if (data.event === 'already_ingame') {
          console.log('already in a game');
        }
        if (data.event === 'game_address') {
          console.log(data.message);
          setState('matched');
        }
      };
      socket.onclose = () => {
        console.log('Socket disconnected');
        setState('disconnected');
      };
      return () => {
        socket.close();
      };
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  const requestRemoteGame = () => {
    console.log('request remote game');
    ws.current?.send(
      JSON.stringify({
        event: 'request_remote_game',
      })
    );
  };

  return (
    <>
      {/* <div className={css.title}>
        <p className={css.cornerBorder}>mode</p>
      </div>
      <ul className={css.modes}>
        {Modes.map((m, i) => (
          <GameMode
            key={i}
            onSelect={() => startGame(m.id)}
            title={m.title}
            desc={m.description}
          />
        ))}
      </ul> */}
      <button onClick={requestRemoteGame}>Request Remote Game</button>
      <button>Request Tournament</button>
      {state == '' && <h1>Connecting...</h1>}
      {state == 'connected' && <h1>Connected</h1>}
      {state == 'matchmaking' && <h1>Matchmaking...</h1>}
      {state == 'inqueue' && <h1>in queue</h1>}
      {state == 'matched' && <h1>created game</h1>}
      {state == 'disconnected' && <h1>disconnected</h1>}
    </>
  );
};

export default ModeSelection;

// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import css from './Games.module.css';
// import FlexHeader from '../../components/Layout/FlexHeader/FlexHeader';
// import { useState } from 'react';
// import PongGame from '../../components/Game/PongGame/PongGame';
// import FlexContainer from '../../components/Layout/FlexContainer/FlexContainer';
// import BodyContainer from '../../components/Layout/BodyContainer/BodyContainer';
// import { useNavigate } from "react-router-dom";

// const generateUniqueGameId = () => {
//   return Math.random().toString(36).substr(2, 9); // Simple unique ID generation
// };

// const ModeSelection = () => {
//   const { isLoggedIn } = useAuth();
//   const [selectedGame, SetSelectedGame] = useState('0');

//   if (!isLoggedIn) {
//     return <Navigate to="/login" />;
//   }

//   const navigate = useNavigate();

//   return (
//     <div className={css.container}>
//       <FlexContainer className={css.container}>
//         <FlexHeader className={css.header}>
//           <section className={css.gameSelect}>
//             <img src="/icons/pong.svg" alt="" />
//             <select
//               value={selectedGame}
//               onChange={(e) => {
//                 SetSelectedGame(e.target.value);
//               }}
//             >
//               <option value="0">PingPong Game</option>
//               <option value="1">Another Game</option>
//             </select>
//           </section>
//           <section className={css.gameCoins}>
//             <p>Coins</p>
//             <p>99999999</p>
//             <img src="/icons/coins.svg" alt="" />
//           </section>
//         </FlexHeader>
//         <BodyContainer className={selectedGame === '0' ? css.lobby : ''}>
//           {selectedGame === '0' && <PongGame />}
//           {selectedGame === '1' && <p>Another game</p>}
//         </BodyContainer>
//       </FlexContainer>
//     </div>
//   );
// };

// export default ModeSelection;
