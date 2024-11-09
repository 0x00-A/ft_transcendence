import { Link } from 'react-router-dom';
import GameButton from '../GameButton/GameButton';
import css from './EndGameScreen.module.css';

import React from 'react';

const EndGameScreen = ({
  isWinner,
  handleRetry,
  handleMainMenu,
  secondAction='Main Menu',
}: {
  isWinner: boolean;
  handleRetry: () => void;
  handleMainMenu: () => void;
  secondAction?: string;
}) => {
  return (
    <div className={css.endGameScreen}>
      <div className={css.winMessage}>
        {isWinner ? 'You Win!' : 'You Lose!'}
      </div>
      <GameButton onClick={handleRetry}>Play Again</GameButton>
      <GameButton onClick={handleMainMenu}>{secondAction}</GameButton>
    </div>
  );
};

export default EndGameScreen;
