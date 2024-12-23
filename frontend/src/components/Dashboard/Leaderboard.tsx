import css from './Leaderboard.module.css';
// API
import { useGetData } from '@/api/apiHooks';
import { API_GET_DASHBOARD_LEADERBOARD_URL } from '@/api/apiConfig';
// Types
import { LeaderBoard } from '@/types/apiTypes';
import { useTranslation } from 'react-i18next';

const Leaderboard = () => {
  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useGetData<LeaderBoard[]>(API_GET_DASHBOARD_LEADERBOARD_URL);
  const { t } = useTranslation();

  return (
    <>
      <div className={css.header}>
        <h3>{t('dashboard.Leaderboard.headerTitle')}</h3>
        <a href="/leaderboard" className={css.viewAll}>
          {t('dashboard.Leaderboard.viewAll')}
        </a>
      </div>

      <div className={css.tables}>
        <div className={css.table}>
          <div className={css.tableHeader}>
            <span>{t('dashboard.Leaderboard.tableHeaders.rank')}</span>
            <span>{t('dashboard.Leaderboard.tableHeaders.name')}</span>
            <span>{t('dashboard.Leaderboard.tableHeaders.games')}</span>
            <span>{t('dashboard.Leaderboard.tableHeaders.winRate')}</span>
            <span>{t('dashboard.Leaderboard.tableHeaders.loseRate')}</span>
            <span>{t('dashboard.Leaderboard.tableHeaders.score')}</span>
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
            <p>{t('dashboard.Leaderboard.noDataFound')}</p>
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
