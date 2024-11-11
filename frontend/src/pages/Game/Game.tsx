import { useEffect, useRef, useState } from 'react';
// import GameMode from './components/GameMode/GameMode';
import css from './Game.module.css';
import GameMode from '../../components/Game/components/GameMode/GameMode';
import { Navigate, useNavigate } from 'react-router-dom';
import RemoteGame from '../../components/Game/RemoteGame/RemoteGame';
import useWebSocket from '../../hooks/useWebSocket';
import getWebSocketUrl from '../../utils/getWebSocketUrl';
import { getToken } from '../../utils/getToken';
import useToken from '../../hooks/useToken';
import TournamentList from '../../components/Tournament/components/TournamentList/TournamentList';
import FlexContainer from '../../components/Layout/FlexContainer/FlexContainer';
import { useGetData } from '../../api/apiHooks';
import { Tournament as TournmentType } from '../../types/apiTypes';
import TournamentCard from '../../components/Tournament/components/TournamentCard/TournamentCard';
import RemoteTournament from '../../components/Tournament/RemoteTournament/RemoteTournament';
import CreateTournamentModal from '../../components/Tournament/components/CreateTournamentModal/CreateTournamentModal';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LocalGame from '../../components/Game/LocalGame/LocalGame';
import ArcadeLoader from '../../components/Game/components/ArcadeLoader/ArcadeLoader';
import Tournament from '../../components/Tournament/Tournament/Tournament';
import { toast } from 'react-toastify';


const Modes = [
  {
    id: 0,
    title: 'local play',
    description: 'Play locally with a firend or computer',
  },
  { id: 1, title: 'remote play', description: 'Compete against other players' },
  { id: 2, title: 'tournament', description: 'View or create a tournament' },
  {
    id: 3,
    title: 'Local Tournament',
    description: 'Host a tournament locally',
  },
];

type User = [
  {
    username: string;
    id: number;
  },
];

const Game = () => {
  const [selectedMode, setSelectedMode] = useState<number | null>(null);
  const [state, setState] = useState('');
  const [gameAdrress, setGameAdrress] = useState(null);
  const [matchAdrress, setMatchAdrress] = useState(null);
  const ws = useRef<WebSocket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInTournament, setIsInTournament] = useState(false);
  const tournamentIdRef = useRef<number | null>(null);
  const [tournamentStatus, setTournamentStatus] = useState('');
  const [tournamentStat, setTournamentStat] = useState(null);
  const [showTournamentView, setShowTournamentView] = useState(false);
  const [user, setUser] = useState('');
  const [opponentReady, setOpponentReady] = useState(false);

  // const { data: user } = useGetData<User>('matchmaker/current-user');

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTournamentSubmit = (name: string) => {
      if (
        ws.current &&
        ws.current.readyState === WebSocket.OPEN
      ) {
        ws.current?.send(
          JSON.stringify({
            event: 'request_tournament',
            tournament_name: name,
          })
        );
      }
    refetch();
  };

  const navigate = useNavigate();

  const token = useToken();

  const { data: tournament, refetch: refetchUserTournament } =
    useGetData<TournmentType>('matchmaker/tournaments/user-tournament');

  const {
    data: tournaments,
    isLoading,
    error,
    refetch,
  } = useGetData<TournmentType[]>('matchmaker/tournaments');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const wsUrl = `${getWebSocketUrl('matchmaking/')}`;
      const socket = new WebSocket(wsUrl);
      ws.current = socket;

      socket.onopen = () => {
        console.log('Socket connected');
        setState('connected');
      };

      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data);

        if (data.event === 'authenticated') {
          setUser(data.username);
        }
        if (data.event === 'error') {
          toast(data.message);
        }
        if (data.event === 'match_start') {
          setMatchAdrress(data.match_address);
          setTournamentStatus('match_started');
        }
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
          setGameAdrress(data.game_address);
          setState('game_start');
        }
        if (data.event === 'tournament_created') {
          console.log(data.message);
          setIsInTournament(true);
          setTournamentStat(data.tournament_stat);
          // toast(data.message);
          toast(data.message);
        }
        if (data.event === 'already_in_tournament') {
          console.log(data.message);

          setIsInTournament(true);
          setTournamentStatus(data.tournament_status);
          tournamentIdRef.current = data.tournament_id;
          setTournamentStat(data.tournament_stat);
        }
        if (data.event === 'tournament_joined') {
          console.log(data.message);

          setIsInTournament(true);
          setTournamentStatus(data.tournament_status);
          tournamentIdRef.current = data.tournament_id;
          setTournamentStat(data.tournament_stat);
          toast(data.message);
        }
        if (data.event === 'tournament_update') {
          console.log(data);

          setIsInTournament(true);
          // setTournamentStatus(data.tournament_status);
          tournamentIdRef.current = data.tournament_id;
          setTournamentStat(data.tournament_stat);
        }
        if (data.event === 'opponent_ready') {
            setOpponentReady(true);
        }
        if (data.event === 'opponent_unready') {
            setOpponentReady(false);
        }
      };
      socket.onclose = () => {
        console.log('Matchmaker Socket disconnected');
        setState('disconnected');
      };
    }, 500);

    return () => {
      if (ws.current) {
        console.log('Closing matchmaker websocket ....');
        ws.current.close();
      }
      clearTimeout(timeout);
    };
  }, []);

  const requestRemoteGame = () => {
    console.log('request remote game');
    ws.current?.send(
      JSON.stringify({
        event: 'request_remote_game',
      })
    );
  };

  const requestTournament = () => {
    if (isInTournament) {
      console.log('showing tournament view');
      setShowTournamentView(true);
      return;
    }
    setIsModalOpen(true);
    console.log('request tournament');
  };

  const handleJoin = (tournamentId: number) => {
    console.log('join tournament');
    ws.current?.send(
      JSON.stringify({
        event: 'join_tournament',
        tournament_id: tournamentId,
      })
    );
    refetch();
  };
  const handleView = () => {
    if (isInTournament) {
      console.log('showing tournament view');
      setShowTournamentView(true);
      return;
    }
  };

  const showToast = () => {
    // toast('This is a top-center notification!', {});
    toast('This is a top-center notification!', {});
  };

  const handleReturn = () => {
    setState('');
    setSelectedMode(null);
    setShowTournamentView(false);
  }

  if (selectedMode === 0) {
    return <LocalGame onReturn={handleReturn} />;
  }

  if (selectedMode === 1) {
    requestRemoteGame();
    setSelectedMode(null);
  }
  if (selectedMode === 2) {
    requestTournament();
    setSelectedMode(null);
  }

  if (selectedMode === 3) {
    return <Tournament onReturn={handleReturn} />;
  }

  if (state === 'inqueue') {
    return (
      <div className={css.matchmakingLoaderWrapper}>
        <ArcadeLoader className={css.matchmakingLoader} />
      </div>
    );
  }

  if (state === 'game_start') {
    if (gameAdrress) return <RemoteGame onReturn={handleReturn} requestRemoteGame={requestRemoteGame} game_address={gameAdrress} />;
  }

  if (showTournamentView)
    return (
      <RemoteTournament
        key={tournamentIdRef.current}
        matchAddress={matchAdrress}
        tournamentStatus={tournamentStatus}
        setTournamentStatus={setTournamentStatus}
        tournamentStat={tournamentStat}
        user={user}
        ws={ws.current}
        onReturn={handleReturn}
        opponentReady={opponentReady}
        setOpponentReady={setOpponentReady}
      />
    );

  return (
    <div className={css.container}>
      <div className={css.modeSelectDiv}>
        <div className={css.title}>
          <p className={css.cornerBorder}>mode</p>
        </div>
        <ul className={css.modes}>
          {Modes.map((m, i) => (
            <GameMode
              key={i}
              onSelect={() => setSelectedMode(m.id)}
              title={m.title}
              desc={m.description}
            />
          ))}
        </ul>
        <CreateTournamentModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleTournamentSubmit}
        />
      </div>
      {/* <div className={css.title}>
        <p className={css.cornerBorder}>Tournaments</p>
      </div>
      <div className={css.tournamentsDiv}>
        <TournamentList
          handleJoin={handleJoin}
          handleView={handleView}
          tournaments={tournaments}
          error={error}
          isLoading={isLoading}
        ></TournamentList>
      </div> */}
    </div>
  );
};

export default Game;
