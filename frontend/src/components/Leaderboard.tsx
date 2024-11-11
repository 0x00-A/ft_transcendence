import React from 'react';
import css from './Leaderboard.module.css';

const leaderboardData = [
  { rank: 1, name: 'essam', games: 586, winRate: '70%', loseRate: '30%', score: 6305, avatar: 'https://picsum.photos/200' },
  { rank: 2, name: 'rel-sima', games: 586, winRate: '65%', loseRate: '35%', score: 1135, avatar: 'https://picsum.photos/201' },
  { rank: 3, name: 'nel-baz', games: 586, winRate: '53%', loseRate: '35%', score: 935, avatar: 'https://picsum.photos/202' },
  { rank: 4, name: 'aigounad', games: 586, winRate: '40%', loseRate: '35%', score: 835, avatar: 'https://picsum.photos/203' },
  { rank: 5, name: 'ezz-ghba', games: 586, winRate: '30%', loseRate: '35%', score: 535, avatar: 'https://picsum.photos/204' },
  // Repeat similar items to match the layout shown in your screenshot
];

const Leaderboard = () => {
  return (
      <>
        <div className={css.header}>
          <h3>Leaderboard</h3>
          <a href="/leaderboard" className={css.viewAll}>view all leaderboard</a>
        </div>

        <div className={css.table}>
          <div className={css.tableHeader}>
            <span>rank</span>
            <span>name</span>
            <span>games</span>
            <span>Win rate</span>
            <span>lose rate</span>
            <span>Score</span>
          </div>

          {leaderboardData.map((player, index) => (
            <div className={css.tableRow} key={index}>
              <span>{player.rank}</span>
              <span className={css.player}>
                <img src={player.avatar} alt={player.name} className={css.avatar} />
                {player.name}
              </span>
              <span>{player.games}</span>
              <span>{player.winRate}</span>
              <span>{player.loseRate}</span>
              <span className={css.score}>{player.score}</span>
          </div>
        ))}
      </div>
      </>
  );
};

export default Leaderboard;
