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
import { Tournament as TournmentType } from '../../types/apiTypes';
import RemoteTournament from '../../components/Tournament/RemoteTournament/RemoteTournament';
import CreateTournamentModal from '../../components/Tournament/components/CreateTournamentModal/CreateTournamentModal';
// import 'react-toastify/dist/ReactToastify.css';
import LocalGame from '../../components/Game/LocalGame/LocalGame';
import ArcadeLoader from '../../components/Game/components/ArcadeLoader/ArcadeLoader';
import Tournament from '../../components/Tournament/Tournament/Tournament';
import { toast } from 'react-toastify';
import ErrorMessage from '@/components/Game/components/ErrorMessage/ErrorMessage';
import NoTournamentIcon from './NoTournament/NoTournamnet';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';

  const Modes = [
    { id: 0, title: 'Local Game', icon: Gamepad2, description: 'Play with friends' },
    { id: 1, title: 'Remote Game', icon: Globe, description: 'Challenge online' },
    { id: 2, title: 'Remote Tournament', icon: Trophy, description: 'Create Online tournament' },
    { id: 3, title: 'Local Tournament', icon: Users, description: 'Local tournament' },
  ];

const Game = () => {
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<number | null>(null);
  const [state, setState] = useState('');
  const [gameAdrress, setGameAdrress] = useState<string | null>(null);
  const [matchAdrress, setMatchAdrress] = useState(null);
  const ws = useRef<WebSocket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInTournament, setIsInTournament] = useState(false);
  const tournamentIdRef = useRef<number | null>(null);
  const [tournamentStatus, setTournamentStatus] = useState('');
  const [tournamentStat, setTournamentStat] = useState(null);
  const [showTournamentView, setShowTournamentView] = useState(false);
  // const [user, setUser] = useState('');
  const [opponentReady, setOpponentReady] = useState(false);

  const { user } = useUser()

  // const {user: authUser} = useAuth();

  // console.log('>>>>>>>>>', currentUser?.username);


  const {matchmakerMessage, sendMatchmakerMessage, setMatchmakerMessage} = useWebSocket()

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTournamentSubmit = (name: string) => {
      // if (
      //   se &&
      //   se.readyState === WebSocket.OPEN
      // ) {
      //   se?.send(
      //     JSON.stringify({
      //       event: 'request_tournament',
      //       tournament_name: name,
      //     })
      //   );
      // }
      sendMatchmakerMessage({
            event: 'request_tournament',
            tournament_name: name,
          })
  };

  const refetchData = () => {
    refetchUserTournaments()
    refetchTournaments()
  }


  const { data: userTournaments, isLoading: userTournamentsIsLoading, error: userTournamentsError, refetch: refetchUserTournaments } =
    useGetData<TournmentType[]>('matchmaker/tournaments/user-tournaments');

  const {
    data: tournaments,
    isLoading,
    error,
    refetch: refetchTournaments,
  } = useGetData<TournmentType[]>('matchmaker/tournaments');

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     const wsUrl = `${getWebSocketUrl('matchmaking/')}`;
  //     const socket = new WebSocket(wsUrl);
  //     se = socket;

  //     socket.onopen = () => {
  //       console.log('Socket connected');
  //       setState('connected');
  //     };

  //     socket.onmessage = (e) => {
  //       refetchData();
  //       const data = JSON.parse(e.data);
  //       console.log(data);

  //       if (data.event === 'authenticated') {
  //         setUser(data.username);
  //       }
  //       if (data.event === 'error') {
  //         toast(data.message);
  //       }
  //       if (data.event === 'match_start') {
  //         setMatchAdrress(data.match_address);
  //         setTournamentStatus('match_started');
  //       }
  //       if (data.event === 'in_queue') {
  //         setState('inqueue');
  //       }

  //       if (data.event === 'already_inqueue') {
  //         console.log('already in queue');
  //       }
  //       if (data.event === 'already_ingame') {
  //         console.log('already in a game');
  //       }
  //       if (data.event === 'game_address') {
  //         console.log(data.message);
  //         setGameAdrress(data.game_address);
  //         setState('game_start');
  //       }
  //       if (data.event === 'tournament_created') {
  //         console.log(data.message);
  //         setIsInTournament(true);
  //         setTournamentStat(data.tournament_stat);
  //         // toast(data.message);
  //         toast(data.message);
  //       }
  //       if (data.event === 'already_in_tournament') {
  //         console.log(data.message);

  //         setIsInTournament(true);
  //         setTournamentStatus(data.tournament_status);
  //         tournamentIdRef.current = data.tournament_id;
  //         setTournamentStat(data.tournament_stat);
  //       }
  //       if (data.event === 'tournament_joined') {
  //         console.log(data.message);

  //         setIsInTournament(true);
  //         setTournamentStatus(data.tournament_status);
  //         tournamentIdRef.current = data.tournament_id;
  //         setTournamentStat(data.tournament_stat);
  //         toast(data.message);
  //       }
  //       if (data.event === 'tournament_update') {
  //         console.log(data);

  //         setIsInTournament(true);
  //         // setTournamentStatus(data.tournament_status);
  //         tournamentIdRef.current = data.tournament_id;
  //         setTournamentStat(data.tournament_stat);
  //       }
  //       if (data.event === 'opponent_ready') {
  //           setOpponentReady(true);
  //       }
  //       if (data.event === 'opponent_unready') {
  //           setOpponentReady(false);
  //       }
  //     };
  //     socket.onclose = () => {
  //       console.log('Matchmaker Socket disconnected');
  //       setState('disconnected');
  //     };
  //   }, 500);

  //   return () => {
  //     if (se) {
  //       console.log('Closing matchmaker websocket ....');
  //       se.close();
  //     }
  //     clearTimeout(timeout);
  //   };
  // }, []);

  useEffect(() => {
    if (matchmakerMessage) {
      // refetchData();
      console.log('Matchmaker WebSocket Message:', matchmakerMessage);
      const data = matchmakerMessage;
      // if (data.event === 'authenticated') {
      //   setUser(data.username);
      // }
      if (data.event === 'match_start') {
        setMatchAdrress(data.match_address);
        setTournamentStatus('match_started');
      }
      if (data.event === 'in_queue') {
        setState('inqueue');
      }
      if (data.event === 'error') {
        toast.error(data.message);
      }

      if (data.event === 'already_inqueue') {
        console.log('already in queue');
        toast(data.message)
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
    }

  }, [matchmakerMessage]);

  useEffect(() => {

    return () => {
      sendMatchmakerMessage({
        event: 'remove_from_queue',
      });
      setMatchmakerMessage({});
    }
  }, [])


  const requestRemoteGame = () => {
    console.log('request remote game');
    // se?.send(
    //   JSON.stringify({
    //     event: 'request_remote_game',
    //   })
    // );
    sendMatchmakerMessage({
        event: 'request_remote_game',
      })

  };

  const requestTournament = () => {
    // if (isInTournament) {
    //   console.log('showing tournament view');
    //   setShowTournamentView(true);
    //   return;
    // }
    setIsModalOpen(true);
    console.log('request tournament');
  };

  const handleJoin = (tournamentId: number) => {
    console.log('join tournament');
    // se?.send(
    //   JSON.stringify({
    //     event: 'join_tournament',
    //     tournament_id: tournamentId,
    //   })
    // );
    sendMatchmakerMessage({
        event: 'join_tournament',
        tournament_id: tournamentId,
      })
  };
  const handleView = () => {
    if (isInTournament) {
      console.log('showing tournament view');
      setShowTournamentView(true);
      return;
    }
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
      <div className={styles.matchmakingLoaderWrapper}>
        <ArcadeLoader className={styles.matchmakingLoader} />
        <button onClick={() => {
          sendMatchmakerMessage({
            event: 'remove_from_queue',
          });
          setState('');
        }} >Cancel</button>
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
        user={user!.username}
        ws={sendMatchmakerMessage}
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
                        setTournamentStatus(tournament.status);
                        setShowTournamentView(true);
                    }}>
                        <div>
                          <h3 className={styles.tournamentName}>{tournament.name}</h3>
                          <p className={styles.tournamentPlayerCount}>Players: {tournament.players}</p>
                        </div>
                        <div className={styles.rightAligned}>
                          <p className={styles.tournamentStatus}>Status: {tournament.status}</p>
                          <p className={styles.tournamentDate}>Started: {tournament.created_at}</p>
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
                    handleView={handleView}
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
