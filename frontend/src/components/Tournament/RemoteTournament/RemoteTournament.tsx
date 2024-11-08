import React, { PropsWithChildren, useEffect, useState } from 'react';
import css from './RemoteTournament.module.css';
import { useGetData } from '../../../api/apiHooks';
import RemoteGame from '../../Game/RemoteGame/RemoteGame';
import TournamentHeader from '../components/TournamentHeader/TournamentHeader';
import WinnerOverlay from '../components/WinnerOverlay/WinnerOverlay';

function IconLabelButtons({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className={`${css.playButton}`}>
      Ready
    </button>
  );
}

const Match = ({
  player1,
  player2,
  winner,
  currentUser,
  onClick,
  status,
  winnerOfMatch1 = null,
  winnerOfMatch2 = null,
}: {
  player1: string;
  player2: string;
  winner: string;
  onClick: () => void;
  currentUser: string;
  status: string;
  winnerOfMatch1?: string | null;
  winnerOfMatch2?: string | null;
}) => {
  return (
    <div className={css.matchup}>
      <div className={css.participants}>
        <div
          className={`${css.participant} ${winner && winner === player1 ? css.winner : ''}`}
        >
          <span>{player1 || winnerOfMatch1 || 'TBD'}</span>
        </div>
        <div
          className={`${css.participant} ${winner && winner === player2 ? css.winner : ''}`}
        >
          <span>{player2 || winnerOfMatch2 || 'TBD'}</span>
        </div>
      </div>
      {(currentUser === player1 || currentUser === player2) &&
        status == 'waiting' && <IconLabelButtons onClick={onClick} />}
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

type Match = {
  player1: string;
  player2: string;
  winner: string;
  match_id: number;
  status: string;
};

type Rounds = {
  [key: number]: Match[];
};

const RemoteTournament = ({
  tournamentStat,
  user,
  tournamentStatus,
  matchAddress,
  setTournamentStatus,
  ws,
}: {
  tournamentStat: any;
  user: string;
  tournamentStatus: string;
  matchAddress: string | null;
  setTournamentStatus: React.Dispatch<React.SetStateAction<string>>;
  ws: WebSocket | null;
}) => {
  const [rounds, setRounds] = useState<Rounds>(tournamentStat.rounds);
  const [winnerOfMatch1, setWinnerOfMatch1] = useState<string | null>(
    rounds[1][0]?.winner
  );
  const [winnerOfMatch2, setWinnerOfMatch2] = useState<string | null>(
    rounds[1][1]?.winner
  );
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    setRounds(tournamentStat.rounds);
    setWinnerOfMatch1(rounds[1][0]?.winner);
    setWinnerOfMatch2(rounds[1][1]?.winner);
    if (tournamentStat.winner) setShowWinner(true);
  }, [tournamentStat]);

  console.log(tournamentStat);

  const playerReady = (match_id: number) => {
    ws?.send(
      JSON.stringify({
        event: 'player_ready',
        match_id: match_id,
      })
    );
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains(css.overlay)) {
      setShowWinner(false);
    }
  };

  if (tournamentStatus === 'match_started') {
    if (matchAddress)
      return (
        <>
          <button onClick={() => setTournamentStatus('match_ended')}>
            Go Back
          </button>
          <RemoteGame game_address={matchAddress} />
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
                  player1={rounds[1][0]?.player1}
                  player2={rounds[1][0]?.player2}
                  winner={rounds[1][0]?.winner}
                  status={rounds[1][0]?.status}
                  currentUser={user}
                  onClick={() => playerReady(rounds[1][0].match_id)}
                />
                <Match
                  player1={rounds[1][1]?.player1}
                  player2={rounds[1][1]?.player2}
                  winner={rounds[1][1]?.winner}
                  status={rounds[1][1]?.status}
                  currentUser={user}
                  onClick={() => playerReady(rounds[1][1].match_id)}
                />
              </div>
              <Connector />
            </div>
          </section>

          <section className={`${css.round} ${css.finals}`}>
            <div className={css.winners}>
              <div className={css.matchups}>
                <Match
                  player1={rounds[2][0]?.player1}
                  player2={rounds[2][0]?.player2}
                  winnerOfMatch1={winnerOfMatch1}
                  winnerOfMatch2={winnerOfMatch2}
                  winner={rounds[2][0]?.winner}
                  status={rounds[2][0]?.status}
                  currentUser={user}
                  onClick={() => playerReady(rounds[2][0].match_id)}
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
    </div>
  );
};

export default RemoteTournament;
