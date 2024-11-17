import styles from './Game.module.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Shield, Users, Trophy, Globe, ArrowRight, Gamepad2, Key } from 'lucide-react';


import { useEffect, useRef, useState } from 'react';
// import GameMode from './components/GameMode/GameMode';
import RemoteGame from '../../components/Game/RemoteGame/RemoteGame';
import getWebSocketUrl from '../../utils/getWebSocketUrl';
import TournamentList from '../../components/Tournament/components/TournamentList/TournamentList';
import { useGetData } from '../../api/apiHooks';
import { TournamentState, Tournament as TournmentType } from '../../types/apiTypes';
import RemoteTournament from '../../components/Tournament/RemoteTournament/RemoteTournament';
import CreateTournamentModal from '../../components/Tournament/components/CreateTournamentModal/CreateTournamentModal';
import 'react-toastify/dist/ReactToastify.css';
import LocalGame from '../../components/Game/LocalGame/LocalGame';
import ArcadeLoader from '../../components/Game/components/ArcadeLoader/ArcadeLoader';
import Tournament from '../../components/Tournament/Tournament/Tournament';
import { toast } from 'react-toastify';
import ErrorMessage from '@/components/Game/components/ErrorMessage/ErrorMessage';
import NoTournamentIcon from './NoTournament/NoTournamnet';
import { useUser } from '@/contexts/UserContext';
import { useGameInvite } from '@/contexts/GameInviteContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/helpers';

  const Modes = [
    { id: 0, title: 'Local Game', icon: Gamepad2, description: 'Play with friends' },
    { id: 1, title: 'Remote Game', icon: Globe, description: 'Challenge online' },
    { id: 2, title: 'Remote Tournament', icon: Trophy, description: 'Create Online tournament' },
    { id: 3, title: 'Local Tournament', icon: Users, description: 'Local tournament' },
  ];

const Game = () => {
      const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'started' | 'inqueue' | null>(null);
  const [gameAdrress, setGameAdrress] = useState(null);
  const [matchAdrress, setMatchAdrress] = useState(null);
  const ws = useRef<WebSocket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tournamentIdRef = useRef<number | null>(null);
  const [matchStarted, setMatchStarted] = useState(false);
  const [tournamentStat, setTournamentStat] = useState<TournamentState | null>(null);
  const [showTournamentView, setShowTournamentView] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn)
    return;

  const { gameAccepted, gameInvite, setGameAccepted } = useGameInvite();



  const {user} = useUser();

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTournamentSubmit = (name: string) => {
      sendMessage({
            event: 'request_tournament',
            tournament_name: name,
      })
  };

  const refetchData = () => {
    refetchUserTournaments()
    refetchTournaments()
  }


  const { data: userTournaments,
          isLoading: userTournamentsIsLoading,
          error: userTournamentsError,
          refetch: refetchUserTournaments } = useGetData<TournmentType[]>('matchmaker/tournaments/user-tournaments');

  const {
    data: tournaments,
    isLoading,
    error,
    refetch: refetchTournaments,
  } = useGetData<TournmentType[]>('matchmaker/tournaments');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const wsUrl = `${getWebSocketUrl('matchmaking/')}`;
      const socket = new WebSocket(wsUrl);
      ws.current = socket;

      socket.onopen = () => {
        console.log('Matchmaker Socket connected');
      };

      socket.onmessage = (e) => {
        refetchData();
        const data = JSON.parse(e.data);
        console.log(data);

        if (data.event === 'error') {
          toast.error(data.message);
        }
        if (data.event === 'success') {
          toast.success(data.message);
        }
        if (data.event === 'match_start') {
          setMatchAdrress(data.match_address);
          setMatchStarted(true);
        }
        if (data.event === 'in_queue') {
          setGameState('inqueue');
        }
        if (data.event === 'game_address') {
          setGameAdrress(data.game_address);
          setGameState('started');
        }
        if (data.event === 'tournament_update') {
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
      };
    }, 500);

    return () => {
      if (ws.current) {
        console.log('Closing matchmaker websocket ....');
        ws.current.close();
      }
      clearTimeout(timeout);
      setGameAccepted(false);
    };
  }, []);

  const sendMessage = (message: Record<string, any>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log(`sending message: ${message}`);

      ws.current.send(JSON.stringify(message));
    }
  };

  const requestRemoteGame = () => {
    console.log('request remote game');
    sendMessage({
        event: 'request_remote_game',
    })
  };

  const requestTournament = () => {
    setIsModalOpen(true);
    console.log('request tournament');
  };

  const handleJoin = (tournamentId: number) => {
    sendMessage({
        event: 'join_tournament',
        tournament_id: tournamentId,
    })
  };

  const handleReturn = () => {
    setGameState(null);
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

  if (gameState === 'inqueue' && !(gameAccepted && gameInvite)) {
    return (
      <div className={styles.matchmakingLoaderWrapper}>
        <ArcadeLoader className={styles.matchmakingLoader} />
        <button onClick={() => {
          sendMessage({
            event: 'remove_from_queue',
          });
          setGameState(null);
        }} >Cancel</button>
      </div>
    );
  }

  if (gameAccepted && gameInvite) {
        return <RemoteGame
          onReturn={() => {
            setGameAccepted(false);
            handleReturn()
          }}
          requestRemoteGame={() => {
            setGameAccepted(false);
            requestRemoteGame();
          }}
          game_address={gameInvite} />;
  }

  if (gameState === 'started') {
    if (gameAdrress) return <RemoteGame onReturn={handleReturn} requestRemoteGame={requestRemoteGame} game_address={gameAdrress} />;
  }

  if (showTournamentView)
    return (
      <RemoteTournament
        key={tournamentIdRef.current}
        matchAddress={matchAdrress}
        matchStarted={matchStarted}
        setMatchStarted={setMatchStarted}
        tournamentStat={tournamentStat}
        user={user!.username}
        sendMessage={sendMessage}
        onReturn={handleReturn}
        opponentReady={opponentReady}
        setOpponentReady={setOpponentReady}
      />
    );

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={styles.left}>
            {Modes.map((option) => (
            <Card
                key={option.id}
                className={`${styles.item} ${styles.cardMode} ${hoveredOption === option.id ? styles.cardHoveredMode : ''}`}
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => setSelectedMode(option.id)}

            >
                <CardContent className={styles.cardContentMode}>
                <option.icon className={styles.iconMode} />
                <CardTitle className={styles.titleMode}>{option.title}</CardTitle>
                <p className={styles.descriptionMode}>{option.description}</p>
                <ArrowRight
                    className={`${styles.arrowIconMode} ${hoveredOption === option.id ? styles.arrowIconHoveredMode : ''}`}
                />
                </CardContent>
            </Card>
            ))}
            <CreateTournamentModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleTournamentSubmit}
            />
        </div>

        <div className={styles.right}>
         <Card className={styles.card}>
            <CardHeader>
                <CardTitle className={styles.title}>Joined Tournaments</CardTitle>
            </CardHeader>
            <CardContent className={styles.content}>
                {userTournaments?.map((tournament) => (
                    <div key={tournament.id} className={styles.tournamentItem} onClick={() => {
                        setTournamentStat(tournament.state);
                        // setTournamentStatus(tournament.status);
                        setShowTournamentView(true);
                    }}>
                        <div>
                          <h3 className={styles.tournamentName}>{tournament.name}</h3>
                          <p className={styles.tournamentPlayerCount}>Players: {tournament.players}</p>
                        </div>
                        <div className={styles.rightAligned}>
                          <p className={styles.tournamentStatus}>Status: {tournament.status}</p>
                          <p className={styles.tournamentDate}>Started: {formatDate(tournament.created_at)}</p>
                        </div>
                    </div>
                ))}
                    {!userTournamentsError && !userTournamentsIsLoading && !userTournaments?.length && (
                    <div className={styles.noTournaments}>
                        <NoTournamentIcon size={58} />
                        <p>You havn't joined any tournaments yet!.</p>
                    </div>
                    )}
                    {userTournamentsError && (
                    <div className={styles.errorWrapper}>
                        <ErrorMessage />
                    </div>
                    )}
                    {!userTournamentsError && userTournamentsIsLoading && (
                    <div className={styles.loaderWrapper}>
                        <ArcadeLoader />
                    </div>
                    )}
            </CardContent>
        </Card>
        </div>
      </div>

      <div className={styles.bottomContainer}>
         <Card className={styles.bottomCard}>
            <CardHeader>
                <CardTitle className={styles.title}>Open Tournaments</CardTitle>
            </CardHeader>
            <CardContent className={styles.bottomCardContent}>
                <TournamentList
                    handleJoin={handleJoin}
                    // handleView={handleView}
                    tournaments={tournaments}
                    error={error}
                    isLoading={isLoading}
                ></TournamentList>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Game;
