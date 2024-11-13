import css from './LevelStat.module.css';

const LevelStat = ({ level, currentXP, xpForNextLevel }) => {

  const xpPercentage = (currentXP / xpForNextLevel) * 100;

  return (
    <div className={css.levelStatConatiner}>
      <div className={css.levelInfo}>
        <h2>Level {level}</h2>
        <p>{currentXP} / {xpForNextLevel} XP</p>
      </div>
      <div className={css.progressBar}>
        <div className={css.progress} style={{ width: `${xpPercentage}%` }}></div>
      </div>
    </div>
  );
};

export default LevelStat;
