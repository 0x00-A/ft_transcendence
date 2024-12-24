import { useTranslation } from 'react-i18next';
import GameButton from '../GameButton/GameButton';
import css from './EndGameScreen.module.css';
import { useEffect } from 'react';

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
  const { t } = useTranslation();

  useEffect(() => {
    const t = setTimeout(() => {
      handleMainMenu();
    }, 3000);

    return () => {
      clearTimeout(t);
    }
  }, [])


  return (
    <div className={css.endGameScreen}>
      <div className={css.winMessage}>
        {t(isWinner ? 'game.localGame.EndGameScreen.Win' : 'game.localGame.EndGameScreen.Lose')}
      </div>
      {!isMatchTournament && <GameButton onClick={handleRetry}>{t('game.localGame.EndGameScreen.PlayAgain')}</GameButton>}
      <GameButton onClick={handleMainMenu}>{t('game.localGame.EndGameScreen.GoBack')}</GameButton>
    </div>
  );
};

export default EndGameScreen;
