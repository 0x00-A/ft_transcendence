
import { useGetData } from '@/api/apiHooks';
import { API_GET_LEADER_BOARD_URL } from '@/api/apiConfig';
import { Trophy, Medal, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LeaderBoard } from '@/types/apiTypes';
import styles from './Leaderboard.module.css';
import { useNavigate } from 'react-router-dom';

const LeaderboardPage = () => {
  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useGetData<LeaderBoard[]>(API_GET_LEADER_BOARD_URL);
  const { t } = useTranslation();
  const navigate = useNavigate();



  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className={styles.trophy} />;
      case 2:
        return <Medal className={styles.silverMedal} />;
      case 3:
        return <Medal className={styles.bronzeMedal} />;
      default:
        return <span className={styles.rank}>{rank}</span>;
    }
  };

  const renderTopRanks = () => {
    if (!leaderboardData || leaderboardData.length < 3) return null;

    const [first, second, third] = leaderboardData;
    
    return (
      <div className={styles.podium}>
        <div className={styles.podiumPlace}>
          <div className={`${styles.podiumAvatar} ${styles.secondPlace}`}>
            <img src={second.avatar} alt={second.username} />
          </div>
          <Medal className={styles.silverMedal} />
          <span className={styles.podiumUsername}>{second.username}</span>
          <span className={styles.podiumScore}>{second.score.toLocaleString()} pts</span>
        </div>

        <div className={`${styles.podiumPlace} ${styles.firstPlace}`}>
          <div className={`${styles.podiumAvatar} ${styles.firstPlaceAvatar}`}>
            <img src={first.avatar} alt={first.username} />
          </div>
          <Trophy className={styles.trophy} />
          <span className={styles.podiumUsername}>{first.username}</span>
          <span className={styles.podiumScore}>{first.score.toLocaleString()} pts</span>
        </div>

        <div className={styles.podiumPlace}>
          <div className={`${styles.podiumAvatar} ${styles.thirdPlace}`}>
            <img src={third.avatar} alt={third.username} />
          </div>
          <Medal className={styles.bronzeMedal} />
          <span className={styles.podiumUsername}>{third.username}</span>
          <span className={styles.podiumScore}>{third.score.toLocaleString()} pts</span>
        </div>
      </div>
    );
  };

  const renderSkeletonRows = () => {
    return Array(8).fill(0).map((_, i) => (
      <div key={i} className={styles.skeleton}>
        <div className={styles.skeletonItem} />
        <div className={styles.playerCell}>
          <div className={styles.skeletonAvatar} />
          <div className={styles.skeletonItem} style={{ flex: 1 }} />
        </div>
        <div className={styles.skeletonItem} />
        <div className={styles.skeletonItem} />
        <div className={styles.skeletonItem} />
      </div>
    ));
  };

  return (
    <div className={styles.container}>

      {renderTopRanks()}

        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <div className={styles.tableHeaderCell}>
              {t('dashboard.Leaderboard.tableHeaders.rank')}
            </div>
            <div className={styles.tableHeaderCell}>
              {t('dashboard.Leaderboard.tableHeaders.name')}
            </div>
            <div className={`${styles.tableHeaderCell} ${styles.centered}`}>
              {t('dashboard.Leaderboard.tableHeaders.games')}
            </div>
            <div className={`${styles.tableHeaderCell} ${styles.centered}`}>
              {t('dashboard.Leaderboard.tableHeaders.winRate')}
            </div>
            <div className={`${styles.tableHeaderCell} ${styles.centered}`}>
              {t('dashboard.Leaderboard.tableHeaders.score')}
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error.message}
            </div>
          )}

          {isLoading ? (
            renderSkeletonRows()
          ) : leaderboardData && leaderboardData.length === 0 ? (
            <div className={styles.noData}>
              {t('dashboard.Leaderboard.noDataFound')}
            </div>
          ) : (
            <div className={styles.tablesRows}>
              { leaderboardData &&
              leaderboardData.slice(3).map((player: LeaderBoard) => (
                <div
                  key={player.rank}
                  onClick={() => navigate(`/profile/${player.username}`)}
                  className={styles.tableRow}
                >
                  <div className={styles.rankCell}>
                    {getRankBadge(player.rank)}
                  </div>
                  <div className={styles.playerCell}>
                    <img
                      src={player.avatar}
                      alt={player.username}
                      className={styles.avatar}
                    />
                    <span className={styles.username}>
                      {player.username}
                    </span>
                  </div>
                  <div className={styles.centered}>
                    {player.played_games}
                  </div>
                  <div className={styles.centered}>
                    {Number.isInteger(player.win_rate)
                      ? player.win_rate
                      : player.win_rate.toFixed(1)}%
                  </div>
                  {player.score.toLocaleString() === '0' ? (
                    <div className={styles.scoreDown}>
                      {player.score.toLocaleString()}
                      <TrendingDown className={styles.scoreIconDown} />
                    </div>
                  ) : (
                    <div className={styles.scoreUp}>
                      {player.score.toLocaleString()}
                      <TrendingUp className={styles.scoreIcon} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        }
        </div>
      </div>
  );
};

export default LeaderboardPage;