import GameButton from '../GameButton/GameButton';
import css from './EndGameScreen.module.css';

const EndGameScreen = ({
  isWinner,
  handleRetry,
  handleMainMenu,
  isMatchTournament = false,
}: {
  isWinner: boolean;
  handleRetry: () => void;
  handleMainMenu: () => void;
  isMatchTournament?: boolean;
}) => {
  return (
    <div className={css.endGameScreen}>
      <div className={css.winMessage}>
        {isWinner ? 'You Win!' : 'You Lose!'}
      </div>
      {!isMatchTournament && <GameButton onClick={handleRetry}>Play Again</GameButton>}
      <GameButton onClick={handleMainMenu}>{'Go Back'}</GameButton>
    </div>
  );
};

export default EndGameScreen;
