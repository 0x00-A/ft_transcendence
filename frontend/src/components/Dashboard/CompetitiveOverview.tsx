import { useState } from 'react';
import { TrendingUp, Crown, Award } from 'lucide-react';
import styles from './CompetitiveOverview.module.css';

const CompetitiveOverview = () => {
  const [activeGameMode, setActiveGameMode] = useState('single');

  const personalBests = [
    { label: 'Highest Score', value: '835', Icon: Crown },
    { label: 'Longest Streak', value: '12', Icon: TrendingUp },
    { label: 'Best Rank', value: '#4', Icon: Award },
  ];

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

      {/* Main Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>1010</span>
          <span className={styles.statLabel}>GAMES</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>635</span>
          <span className={styles.statLabel}>SCORE</span>
        </div>
      </div>

      {/* Personal Bests Section */}
      <div className={styles.personalBests}>
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
      </div>

      {/* Bottom Stats Section */}
      <div className={styles.bottomGrid}>
        <div className={styles.winRateContainer}>
          <svg className={styles.circleChart} viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className={styles.circleBackground}
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className={styles.circleProgress}
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={calculateWinRateOffset(76)}
            />
          </svg>
          <div className={styles.winRateContent}>
            <span className={styles.winRateLabel}>Win Rate</span>
            <span className={styles.winRateValue}>76%</span>
          </div>
        </div>

        <div className={styles.winLoseContainer}>
          <div className={styles.winCard}>
            <span className={styles.resultText}>555 WINS</span>
          </div>
          <div className={styles.loseCard}>
            <span className={styles.resultText}>555 LOSE</span>
          </div>
        </div>
      </div>
      </>
  );
};

export default CompetitiveOverview;