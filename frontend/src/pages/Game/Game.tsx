import styles from './Game.module.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Trophy, Globe, ArrowRight, Gamepad2 } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';
// import GameMode from './components/GameMode/GameMode';
import RemoteGame from '../../components/Game/RemoteGame/RemoteGame';
import getWebSocketUrl from '../../utils/getWebSocketUrl';
import TournamentList from '../../components/Tournament/components/TournamentList/TournamentList';
import { useGetData } from '../../api/apiHooks';
import {
  TournamentState,
  Tournament as TournmentType,
} from '../../types/apiTypes';
import RemoteTournament from '../../components/Tournament/RemoteTournament/RemoteTournament';
import CreateTournamentModal from '../../components/Tournament/components/CreateTournamentModal/CreateTournamentModal';
import 'react-toastify/dist/ReactToastify.css';
import LocalGame from '../../components/Game/LocalGame/LocalGame';
import ArcadeLoader from '../../components/Game/components/ArcadeLoader/ArcadeLoader';
import Tournament from '../../components/Tournament/Tournament/Tournament';
import { toast } from 'react-toastify';
import ErrorMessage from '@/components/Game/components/ErrorMessage/ErrorMessage';
import NoTournamentIcon from '../../components/Tournament/components/NoTournament/NoTournamnet';
import { useUser } from '@/contexts/UserContext';
import { useGameInvite } from '@/contexts/GameInviteContext';
import { formatDate } from '@/utils/helpers';
import MatchmakingScreen from '@/components/Game/components/MatchmakingScreen/MatchmakingScreen';
import MultipleGame from '@/components/Game/MultipleGame/MultipleGame';
import { useTranslation } from 'react-i18next';



// const Modes = () => {
//   const { t } = useTranslation();
//   return [
//     { id: 0, title: t('game.localGame.title'), icon: Gamepad2, description: t('game.localGame.description') },
//     { id: 1, title: t('game.remoteGame.title'), icon: Globe, description: t('game.remoteGame.description') },
//     { id: 2, title: t('game.remoteTournament.title'), icon: Trophy, description: t('game.remoteTournament.description') },
//     { id: 3, title: t('game.localTournament.title'), icon: Users, description: t('game.localTournament.description') },
//     { id: 4, title: t('game.multipleGame.title'), icon: Users, description: t('game.multipleGame.description') },
//     ];
// }

  const Game = () => {
  const { t } = useTranslation();
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<number | null>(null);
  const [gameState, setGameState] = useState<
    'startGame' | 'inqueue' | 'startMultiGame' | null
  >(null);
  const [gameAdrress, setGameAdrress] = useState<string | null>(null);
  const [player1_id, setPlayer1_id] = useState<number | null>(null);
  const [player2_id, setPlayer2_id] = useState<number | null>(null);
  const [matchAdrress, setMatchAdrress] = useState(null);
  const ws = useRef<WebSocket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tournamentIdRef = useRef<number | null>(null);
  const [matchStarted, setMatchStarted] = useState(false);
  const [tournamentStat, setTournamentStat] = useState<TournamentState | null>(
    null
  );
  const [showTournamentView, setShowTournamentView] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  // const isUnmounting = useRef(false);

  // const { isLoggedIn } = useAuth();

  // if (!isLoggedIn)
  //   return;
  // console.log('Game component rerendered');

  const { gameAccepted, gameInvite, setGameAccepted, player1_id: p1_id, player2_id: p2_id } = useGameInvite();

  const { user } = useUser();

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTournamentSubmit = (name: string) => {
    sendMessage({
      event: 'request_tournament',
      tournament_name: name,
    });
  };

  const refetchData = () => {
    refetchUserTournaments();
    refetchTournaments();
  };

  const {
    data: userTournaments,
    isLoading: userTournamentsIsLoading,
    error: userTournamentsError,
    refetch: refetchUserTournaments,
  } = useGetData<TournmentType[]>('matchmaker/tournaments/user-tournaments');

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
        // console.log('Matchmaker Socket connected');
      };

      socket.onmessage = (e) => {
        refetchData();
        const data = JSON.parse(e.data);
        // console.log(data);

        if (data.event === 'error') {
          toast.error(data.message);
        }
        if (data.event === 'success') {
          toast.success(data.message);
        }
        if (data.event === 'match_start') {
          setMatchAdrress(data.match_address);
          setPlayer1_id(data.player1_id);
          setPlayer2_id(data.player2_id);
          setMatchStarted(true);
        }
        if (data.event === 'in_queue') {
          if (gameState === 'startGame') return;
          setGameState('inqueue');
        }
        if (data.event === 'game_address') {
          setGameAdrress(data.game_address);
          setPlayer1_id(data.player1_id);
          setPlayer2_id(data.player2_id);
          setGameState('startGame');
        }
        if (data.event === 'multigame_address') {
          setGameAdrress(data.game_address);
          setGameState('startMultiGame');
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
        // console.log('Matchmaker Socket disconnected');
      };
    }, 500);

    return () => {
      if (ws.current) {
        // console.log('Closing matchmaker websocket ....');
        sendMessage({
          event: 'remove_from_queue',
        });
        setGameState(null);
        ws.current.close();
      }
      clearTimeout(timeout);
      setGameAccepted(false);
    };
  }, []);

  //   useEffect(() => {
  //   return () => {
  //     // if (isUnmounting.current) {
  //       console.log("Component unmounted, resetting global state.");
  //       setGameAccepted(false); // Update global state only on unmount
  //     // }
  //   };
  // }, [setGameAccepted]);

  // useEffect(() => {
  //   isUnmounting.current = true; // Flag component as ready to unmount
  //   return () => {
  //     isUnmounting.current = false; // Reset flag for dependency changes
  //   };
  // }, []);

  const sendMessage = (message: Record<string, any>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      // console.log(`sending message: ${message}`);

      ws.current.send(JSON.stringify(message));
    }
  };

  const requestRemoteGame = () => {
    // console.log('request remote game');
    sendMessage({
      event: 'request_remote_game',
    });
  };

  const requestMultipleGame = () => {
    // console.log('request multi game');
    sendMessage({
      event: 'request_multiple_game',
    });
  };

  const requestTournament = () => {
    setIsModalOpen(true);
    // console.log('request tournament');
  };

  const handleJoin = (tournamentId: number) => {
    sendMessage({
      event: 'join_tournament',
      tournament_id: tournamentId,
    });
  };

  const handleReturn = () => {
    setGameState(null);
    setSelectedMode(null);
    setShowTournamentView(false);
  };

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

  if (selectedMode === 4) {
    requestMultipleGame();
    setSelectedMode(null);
  }

  if (gameAccepted && gameInvite) {
    return (
      <RemoteGame
        key={gameInvite}
        onReturn={() => {
          setGameAccepted(false);
          handleReturn();
        }}
        requestRemoteGame={() => {
          setGameAccepted(false);
          requestRemoteGame();
        }}
        game_address={gameInvite}
        p1_id={p1_id!}
        p2_id={p2_id!}
      />
    );
  }

  if (gameState === 'startMultiGame' && gameAdrress) {
    return (
      <MultipleGame
        requestMultipleGame={requestMultipleGame}
        game_address={gameAdrress}
        onReturn={handleReturn}
      />
    );
  }

  if (gameState === 'startGame' && gameAdrress) {
    return (
      <RemoteGame
        key={gameAdrress}
        onReturn={handleReturn}
        requestRemoteGame={requestRemoteGame}
        game_address={gameAdrress}
        p1_id={player1_id!}
        p2_id={player2_id!}
      />
    );
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
        p1_id={player1_id!}
        p2_id={player2_id!}
      />
    );

  const ModesList =  [
      { id: 0, title: t('game.localGame.title'), icon: Gamepad2, description: t('game.localGame.description') },
      { id: 1, title: t('game.remoteGame.title'), icon: Globe, description: t('game.remoteGame.description') },
      { id: 2, title: t('game.remoteTournament.title'), icon: Trophy, description: t('game.remoteTournament.description') },
      { id: 3, title: t('game.localTournament.title'), icon: Users, description: t('game.localTournament.description') },
      { id: 4, title: t('game.multipleGame.title'), icon: Users, description: t('game.multipleGame.description') },
    ];
  return (
    <div className={styles.container}>
      {gameState === 'inqueue' && !(gameAccepted && gameInvite) && (
        <div className={styles.modalOverlay}>
          <MatchmakingScreen
            onClick={() => {
              sendMessage({
                event: 'remove_from_queue',
              });
              setGameState(null);
            }}
          />
        </div>
      )}
      <div className={styles.topContainer}>
        <div className={styles.left}>
            {ModesList.map((option) => (
            <Card
              key={option.id}
              className={`${styles.item} ${styles.cardMode} ${hoveredOption === option.id ? styles.cardHoveredMode : ''}`}
              onMouseEnter={() => setHoveredOption(option.id)}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() => setSelectedMode(option.id)}
            >
              <CardContent className={styles.cardContentMode}>
                <option.icon className={styles.iconMode} />
                <CardTitle className={styles.titleMode}>
                  {option.title}
                </CardTitle>
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
                <CardTitle className={styles.title}>{t('game.joinedTournaments.title')}</CardTitle>
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
                          <p className={styles.tournamentPlayerCount}>{t('game.joinedTournaments.players')} {tournament.players.length}</p>
                        </div>
                        <div className={styles.rightAligned}>
                          <p className={styles.tournamentStatus}>{t('game.joinedTournaments.status')} {tournament.status}</p>
                          <p className={styles.tournamentDate}>{t('game.joinedTournaments.started')} {formatDate(tournament.created_at)}</p>
                        </div>
                    </div>
                ))}
                    {!userTournamentsError && !userTournamentsIsLoading && !userTournaments?.length && (
                    <div className={styles.noTournaments}>
                        <NoTournamentIcon size={58} />
                        <p>{t('game.joinedTournaments.noTournament')}</p>
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
                <CardTitle className={styles.title}>{t('game.openTournaments.title')}</CardTitle>
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
