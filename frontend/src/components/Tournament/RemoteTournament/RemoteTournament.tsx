import React, { PropsWithChildren, useEffect, useState } from 'react';
import css from './RemoteTournament.module.css';
import { useGetData } from '../../../api/apiHooks';
import RemoteGame from '../../Game/RemoteGame/RemoteGame';
import TournamentHeader from '../components/TournamentHeader/TournamentHeader';
import WinnerOverlay from '../components/WinnerOverlay/WinnerOverlay';
import ReturnBack from '../../Game/components/ReturnBack/ReturnBack';
import CheckBox from '../../Game/CkeckBox/CheckBox';
import ReadyButton from '../components/ReadyButton/ReadyButton';
import { MessageData } from '@/contexts/WebSocketContext';

function IconLabelButtons({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className={`${css.playButton}`}>
      Ready
    </button>
  );
}

const Match = ({
  // player1,
  // player2,
  // winner,
  // status,
  currentUser,
  handleReady,
  handleCancel,
  winnerOfMatch1 = null,
  winnerOfMatch2 = null,
  opponentReady,
  isReady,
  setIsReady,
  match,
}: {
  // player1: string;
  // player2: string;
  // winner: string;
  // status: string;
  handleReady: () => void;
  handleCancel: () => void;
  currentUser: string;
  winnerOfMatch1?: string | null;
  winnerOfMatch2?: string | null;
  opponentReady: boolean;
  isReady:boolean;
  setIsReady:React.Dispatch<React.SetStateAction<boolean>>;
  match: Match;
}) => {
  return (
    <div className={css.matchup}>
      <div className={css.participants}>
        <div
          className={`${css.participant} ${match?.winner && match?.winner === match?.player1 ? css?.winner : ''}`}
        >
          <span>{match?.player1 || winnerOfMatch1 || 'TBD'}</span>
          {(currentUser === match?.player1) && !match?.winner && (isReady ? <CheckBox checked={true} /> : <CheckBox />)}
          {(currentUser === match?.player2) && !match?.winner && (opponentReady ? <CheckBox checked={true} /> : <CheckBox />)}
        </div>
        <div
          className={`${css.participant} ${match?.winner && match?.winner === match?.player2 ? css?.winner : ''}`}
        >
          <span>{match?.player2 || winnerOfMatch2 || 'TBD'}</span>
          {(currentUser === match?.player2 && !match?.winner) && (
              <CheckBox checked={isReady || false} />
          )}
          {(currentUser === match?.player1 && !match?.winner) && (
              <CheckBox checked={opponentReady || false} />
          )}
        </div>
      </div>
      {(currentUser === match?.player1 || currentUser === match?.player2) &&
        match?.status == 'waiting' &&
        <ReadyButton isReady={isReady} setIsReady={setIsReady} handleCancel={handleCancel} handleReady={handleReady} />
        }

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

type Match = {
  player1: string;
  player2: string;
  winner: string;
  match_id: number;
  status: string;
  player1_ready: boolean;
  player2_ready: boolean;
};

type Rounds = {
  [key: number]: Match[];
};

const RemoteTournament = ({
  tournamentStat,
  user,
  matchStarted,
  matchAddress,
  setMatchStarted,
  sendMessage,
  onReturn,
  opponentReady,
  setOpponentReady,
}: {
  tournamentStat: any;
  user: string;
  matchStarted: boolean;
  matchAddress: string | null;
  setMatchStarted: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: (message: MessageData) => void;
  onReturn: ()=>void;
  opponentReady: boolean;
  setOpponentReady: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [rounds, setRounds] = useState<Rounds>(tournamentStat.rounds);
  const [winnerOfMatch1, setWinnerOfMatch1] = useState<string | null>(
    rounds[1][0]?.winner
  );
  const [winnerOfMatch2, setWinnerOfMatch2] = useState<string | null>(
    rounds[1][1]?.winner
  );
  const [showWinner, setShowWinner] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setRounds(tournamentStat.rounds);
    setWinnerOfMatch1(tournamentStat.rounds[1][0]?.winner);
    setWinnerOfMatch2(tournamentStat.rounds[1][1]?.winner);
    if (tournamentStat.winner) setShowWinner(true);
    for (const round in tournamentStat.rounds) {
      for (const match of tournamentStat.rounds[round]) {
        if (match.player1 === user || match.player2 === user) {
          if (match.player1 === user) {
            // setIsReady(match.player1_ready)
            setOpponentReady(match.player2_ready)
          }
          if (match.player2 === user) {
            // setIsReady(match.player2_ready)
            setOpponentReady(match.player1_ready)
          }
        }
      }
    }
  }, [tournamentStat]);


  useEffect(() => {
    return () => {
      sendMessage({event: 'player_unready',})
    }
  }, [])

  console.log(tournamentStat);

  const playerReady = (match_id: number) => {
  sendMessage({ event: 'player_ready',
          match_id: match_id,})
  };

  const playerUnready = (match_id: number) => {
  sendMessage({
          event: 'player_unready',
          match_id: match_id,
    })
  };

  const handleReturn = () => {
    setMatchStarted(false)
    setIsReady(false);
    setOpponentReady(false);
  }

  if (matchStarted) {
    if (matchAddress)
      return (
        <>
          <RemoteGame isMatchTournament={true} onReturn={handleReturn} game_address={matchAddress} />
        </>
      );
  }

  return (
    <div className={css.container}>
      <div className={css.tournamentBody}>
        <TournamentHeader />
        <div className={css.bracket}>
          <section className={`${css.round} ${css.quarterfinals}`}>
            <div className={css.winners}>
              <div className={css.matchups}>
                <Match
                  match={rounds[1][0]}
                  currentUser={user}
                  handleReady={() => playerReady(rounds[1][0].match_id)}
                  handleCancel={() => playerUnready(rounds[1][0].match_id)}
                  opponentReady={opponentReady}
                  isReady={isReady}
                  setIsReady={setIsReady}
                />
                <Match
                  match={rounds[1][1]}
                  currentUser={user}
                  handleReady={() => playerReady(rounds[1][1].match_id)}
                  handleCancel={() => playerUnready(rounds[1][1].match_id)}
                  opponentReady={opponentReady}
                  isReady={isReady}
                  setIsReady={setIsReady}
                />
              </div>
              <Connector />
            </div>
          </section>

          <section className={`${css.round} ${css.finals}`}>
            <div className={css.winners}>
              <div className={css.matchups}>
                <Match
                  winnerOfMatch1={winnerOfMatch1}
                  winnerOfMatch2={winnerOfMatch2}
                  match={rounds[2][0]}
                  currentUser={user}
                  handleReady={() => playerReady(rounds[2][0].match_id)}
                  handleCancel={() => playerUnready(rounds[2][0].match_id)}
                  opponentReady={opponentReady}
                  isReady={isReady}
                  setIsReady={setIsReady}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <ul className={css.infoList}>
        <li className={css.item}>
          <div className={css.itemLabel}>Players</div>
          <div className={css.text}>{tournamentStat.players.length}/4</div>
        </li>
        <li className={css.item}>
          <div className={css.itemLabel}>Format</div>
          <div className={css.text}>Single Elimination</div>
        </li>
        <li className={css.item}>
          <div className={css.itemLabel}>Status</div>
          <div className={css.text}>{tournamentStat.status}</div>
        </li>
        <li className={css.item}>
          <div className={css.itemLabel}>Created</div>
          <div className={css.text}>{tournamentStat.created_at}</div>
        </li>
      </ul>

      {showWinner && (
        <WinnerOverlay
          winner={tournamentStat?.winner}
          setShowWinner={setShowWinner}
        />
      )}
      <ReturnBack onClick={() => {
          setIsReady(false);
        sendMessage({
            event: 'player_unready',
            // match_id: match_id,
          })
        onReturn()}} />
    </div>
  );
};

export default RemoteTournament;
