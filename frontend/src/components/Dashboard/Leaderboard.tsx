import css from './Leaderboard.module.css';
// API
import { useGetData } from '@/api/apiHooks';
import { API_GET_DASHBOARD_LEADERBOARD_URL } from '@/api/apiConfig';
// Types
import { LeaderBoard } from '@/types/apiTypes';

// const leaderboardData = [
//   { rank: 1, name: 'essam', games: 586, winRate: '70%', loseRate: '30%', score: 6305, avatar: 'https://picsum.photos/200' },
//   { rank: 2, name: 'rel-sima', games: 586, winRate: '65%', loseRate: '35%', score: 1135, avatar: 'https://picsum.photos/201' },
//   { rank: 3, name: 'nel-baz', games: 586, winRate: '53%', loseRate: '35%', score: 935, avatar: 'https://picsum.photos/202' },
//   { rank: 4, name: 'aigounad', games: 586, winRate: '40%', loseRate: '35%', score: 835, avatar: 'https://picsum.photos/203' },
//   { rank: 5, name: 'ezz-ghba', games: 586, winRate: '30%', loseRate: '35%', score: 535, avatar: 'https://picsum.photos/204' },
//   // Repeat similar items to match the layout shown in your screenshot
// ];

const Leaderboard = () => {
  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useGetData<LeaderBoard[]>(API_GET_DASHBOARD_LEADERBOARD_URL);

  return (
    <>
      <div className={css.header}>
        <h3>Leaderboard</h3>
        <a href="/leaderboard" className={css.viewAll}>
          view all leaderboard
        </a>
      </div>

      <div className={css.tables}>
        <div className={css.table}>
          <div className={css.tableHeader}>
            <span>rank</span>
            <span>name</span>
            <span>games</span>
            <span>Win rate</span>
            <span>lose rate</span>
            <span>Score</span>
          </div>
          {error && <p>{error.message}</p>}
          {isLoading ? (
            <div className="table w-full">
              <div className="tableRow grid grid-cols-6 items-center p-2.5 text-base bg-[#283245] mb-1 hover:bg-[#33425E] animate-pulse ">
                <span className="flex">
                  <div className="w-10 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
                </span>
                <span className="player flex items-center">
                  <div className="avatar w-8 h-8 rounded-full bg-gray-400 mr-2 animate-pulse"></div>
                  <span className="w-20 h-4 bg-gray-300 rounded animate-pulse"></span>
                </span>
                <span className="flex">
                  <div className="w-10 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
                </span>
                <span className="flex">
                  <div className="w-10 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
                </span>
                <span className="flex">
                  <div className="w-10 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
                </span>
                <span className="score flex text-[#ffb902] font-bold animate-pulse">
                  <div className="w-16 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
                </span>
              </div>
            </div>
          ) : leaderboardData && leaderboardData.length == 0 ? (
            <p>No data found</p>
          ) : (
            leaderboardData &&
            leaderboardData.length > 0 &&
            leaderboardData.map((player: LeaderBoard, index: number) => (
              <div className={css.tableRow} key={index}>
                <span>{player.rank}</span>
                <span className={css.player}>
                  <img
                    src={player.avatar}
                    alt={player.username}
                    className={css.avatar}
                  />
                  {player.username}
                </span>
                <span>{player.played_games}</span>
                <span>
                  {Number.isInteger(player.win_rate)
                    ? player.win_rate
                    : player.win_rate.toFixed(2)}
                  %
                </span>
                <span>
                  {Number.isInteger(player.lose_rate)
                    ? player.lose_rate
                    : player.lose_rate.toFixed(2)}
                  %
                </span>
                <span className={css.score}>{player.score}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
