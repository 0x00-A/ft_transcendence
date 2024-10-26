import React, { useState } from 'react';
import styles from './Test.module.css'; // Importing the CSS module

const TournamentBracket = ({ players }) => {
  const numRounds = Math.log2(players.length);
  const [matches, setMatches] = useState(() => {
    const allMatches = [];
    let currentRoundPlayers = [...players];

    for (let round = 0; round < numRounds; round++) {
      const roundMatches = [];
      for (let i = 0; i < currentRoundPlayers.length; i += 2) {
        roundMatches.push({
          player1: currentRoundPlayers[i],
          player2: currentRoundPlayers[i + 1],
          winner: null,
          roundIndex: round,
        });
      }
      allMatches.push(roundMatches);
      currentRoundPlayers = roundMatches.map(() => null);
    }
    return allMatches;
  });

  const handleWinnerSelect = (roundIndex, matchIndex, player) => {
    const newMatches = [...matches];
    newMatches[roundIndex][matchIndex].winner = player;

    if (roundIndex < numRounds - 1) {
      const nextRoundMatchIndex = Math.floor(matchIndex / 2);
      const nextRoundMatch = newMatches[roundIndex + 1][nextRoundMatchIndex];

      if (matchIndex % 2 === 0) {
        nextRoundMatch.player1 = player;
      } else {
        nextRoundMatch.player2 = player;
      }
    }

    setMatches(newMatches);
  };

  const Match = ({ match, roundIndex, matchIndex }) => (
    <div className={styles.matchContainer}>
      <div className={styles.matchItem}>
        <div
          className={`${styles.matchBar} ${match.winner === match.player1 ? styles.barWinner : styles.barDefault}`}
        />
        <div
          className={`${styles.matchBox} ${match.winner === match.player1 ? styles.textWinner : ''}`}
          onClick={() =>
            match.player1 &&
            handleWinnerSelect(roundIndex, matchIndex, match.player1)
          }
        >
          <p className={styles.matchBoxText}>{match.player1 || 'TBD'}</p>
        </div>
      </div>
      <div className={styles.matchItem}>
        <div
          className={`${styles.matchBar} ${match.winner === match.player2 ? styles.barWinner : styles.barDefault}`}
        />
        <div
          className={`${styles.matchBox} ${match.winner === match.player2 ? styles.textWinner : ''}`}
          onClick={() =>
            match.player2 &&
            handleWinnerSelect(roundIndex, matchIndex, match.player2)
          }
        >
          <p className={styles.matchBoxText}>{match.player2 || 'TBD'}</p>
        </div>
      </div>
    </div>
  );

  const roundTitles = ['Round 1', 'Semifinals', 'Finals'];

  return (
    <div className={styles.bracketContainer}>
      {/* <div className={styles.header}>
        <div className={styles.roundTitlesContainer}>
          {roundTitles.slice(0, numRounds).map((title, index) => (
            <h3 key={index} className={styles.roundTitle}>
              {title}
            </h3>
          ))}
        </div>
        <button
          onClick={() => window.location.reload()}
          className={styles.resetButton}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64l2.14-2.14M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.36-2.64l-2.14 2.14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Reset
        </button>
      </div> */}
      <div className="flex gap-8">
        {matches.map((round, roundIndex) => (
          <div key={roundIndex} className={styles.matchColumn}>
            <div>
              {round.map((match, matchIndex) => (
                <Match
                  key={matchIndex}
                  match={match}
                  roundIndex={roundIndex}
                  matchIndex={matchIndex}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example usage
const Demo = () => {
  const samplePlayers = [
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
    'Player 5',
    'Player 6',
    'Player 7',
    'Player 8',
  ];

  return <TournamentBracket players={samplePlayers} />;
};

export default Demo;
