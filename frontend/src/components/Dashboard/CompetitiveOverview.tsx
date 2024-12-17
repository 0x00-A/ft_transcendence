import { useEffect, useState } from 'react';
import { TrendingUp, Crown, Award } from 'lucide-react';
import styles from './CompetitiveOverview.module.css';
import { useUser } from '@/contexts/UserContext';

const CompetitiveOverview = () => {
  const [activeGameMode, setActiveGameMode] = useState('single');
  const { user, isLoading, refetch } = useUser();


  // const personalBests = [
  //   { label: 'Highest Score', value: '835', Icon: Crown },
  //   { label: 'Longest Streak', value: '12', Icon: TrendingUp },
  //   { label: 'Best Rank', value: '#4', Icon: Award },
  // ];
  useEffect(() => {
    refetch();
  }, []);

  const calculateWinRateOffset = (percentage: any) => {
    const circumference = 2 * Math.PI * 40;
    return circumference - (percentage / 100) * circumference;
  };

  return (
      <>
        <div className={styles.header}>
        <h3 className={styles.title}>Overview</h3>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setActiveGameMode('single')}
            className={`${styles.button} ${
              activeGameMode === 'single' ? styles.buttonActive : ''
            }`}
          >
            Single Game
          </button>
          <button
            onClick={() => setActiveGameMode('tournaments')}
            className={`${styles.button} ${
              activeGameMode === 'tournaments' ? styles.buttonActive : ''
            }`}
          >
            Tournaments
          </button>
        </div>
      </div>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          { isLoading ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
          <span className={styles.statValue}>{user?.profile.played_games}</span>}
          <span className={styles.statLabel}>GAMES</span>
        </div>
        <div className={styles.statCard}>
          { isLoading ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
          <span className={styles.statValue}>{user?.profile.score}</span>}
          <span className={styles.statLabel}>SCORE</span>
        </div>
      </div>
      <div className={styles.personalBests}>
        <div className={styles.bestCard}>
          <div className={styles.bestContent}>
            <div className={styles.bestInfo}>
              <Crown className={styles.bestIcon} />
              <span className={styles.bestLabel}>Highest Score</span>
            </div>
              {isLoading ? <span className="statValueSkeleton block w-[30px] h-[20px] bg-gray-500 rounded-md animate-pulse"></span>:
              <span className={styles.bestValue}>{user?.profile.stats.highest_score || 0}</span>}
          </div>
        </div>
        <div className={styles.bestCard}>
          <div className={styles.bestContent}>
            <div className={styles.bestInfo}>
              <TrendingUp className={styles.bestIcon} />
              <span className={styles.bestLabel}>Longest Streak</span>
            </div>
              {isLoading ? <span className="statValueSkeleton block w-[30px] h-[20px] bg-gray-500 rounded-md animate-pulse"></span>:
              <span className={styles.bestValue}>{user?.profile.stats.win_streak}</span>}
          </div>
        </div>
        <div className={styles.bestCard}>
          <div className={styles.bestContent}>
            <div className={styles.bestInfo}>
              <Award className={styles.bestIcon} />
              <span className={styles.bestLabel}>Best Rank</span>
            </div>
              {isLoading ? <span className="statValueSkeleton block w-[30px] h-[20px] bg-gray-500 rounded-md animate-pulse"></span>:
              <span className={styles.bestValue}>#{user?.profile.stats.best_rank || user?.profile.rank}</span>}
          </div>
        </div>
      </div>
      {/* Personal Bests Section */}
      {/* <div className={styles.personalBests}>
        {personalBests.map(({ label, value, Icon }, index) => (
          <div key={index} className={styles.bestCard}>
            <div className={styles.bestContent}>
              <div className={styles.bestInfo}>
                <Icon className={styles.bestIcon} />
                <span className={styles.bestLabel}>{label}</span>
              </div>
                <span className={styles.bestValue}>{value}</span>
            </div>
          </div>
        ))}
      </div> */}
      <div className={styles.bottomGrid}>
        <div className={styles.winRateContainer}>
          <svg className={styles.circleChart} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className={styles.circleBackground}
            />
            {isLoading ? <circle cx="50" cy="50" r="40" className='fill-none stroke-gray-500 stroke-[5px] animate-pulse' strokeDasharray={2 * Math.PI * 40} />:
            <circle
              cx="50"
              cy="50"
              r="40"
              className={styles.circleProgress}
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={calculateWinRateOffset(user?.profile.win_rate.toFixed(2))}
            />}
          </svg>
          <div className={styles.winRateContent}>
            <span className={styles.winRateLabel}>Win Rate</span>
            {isLoading ? <span className="statValueSkeleton block w-[40px] h-[40px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={styles.winRateValue}>{Number.isInteger(user?.profile.win_rate) ? user?.profile.win_rate : user?.profile.win_rate.toFixed(2)}%</span>}
          </div>
        </div>

        <div className={styles.winLoseContainer}>
          <div className={styles.winCard}>
            {isLoading ? <span className="statValueSkeleton block w-[40px] h-[30px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={styles.resultText}>{user?.profile.wins} WINS</span>}
          </div>
          <div className={styles.loseCard}>
            {isLoading ? <span className="statValueSkeleton block w-[40px] h-[30px] bg-gray-500 rounded-md animate-pulse"></span>:
            <span className={styles.resultText}>{user?.profile.losses} LOSES</span>}
          </div>
        </div>
      </div>
      </>
  );
};

export default CompetitiveOverview;