import { useState } from 'react';
import css from './LocalGame.module.css';
import GameModeScreen from '../components/GameModeScreen/GameModeScreen';

import { GameScreens } from '../../../types/types';
import Pong from '../components/Pong/Pong';
import EndGameScreen from '../components/EndGameScreen/EndGameScreen';

const LocalGame = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreens>('mode'); // Starting screen is 'mode'
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [isOnePlayerMode, SetIsOnePlayerMode] = useState(false);
  const [sound, SwitchSound] = useState(true);

  const handleNextScreen = (nextScreen: GameScreens) => {
    setCurrentScreen(nextScreen);
  };
  const handleRetry = () => {
    setCurrentScreen('game');
    setIsGameOver(false);
  };
  const handleMainMenu = () => {
    setCurrentScreen('mode');
    setIsGameOver(false);
  };
  return (
    <div className={css.gameArea}>
      {currentScreen === 'mode' && (
        <GameModeScreen
          onNext={handleNextScreen}
          SetIsOnePlayerMode={SetIsOnePlayerMode}
          SwitchSound={SwitchSound}
          sound={sound}
        />
      )}
      {/* {currentScreen === 'difficulty' && (
        <DifficultyScreen onNext={handleNextScreen} />
      )} */}
      {currentScreen === 'game' && (
        <Pong
          onNext={handleNextScreen}
          isGameOver={isGameOver}
          setIsGameOver={setIsGameOver}
          setIsWinner={setIsWinner}
          isOnePlayerMode={isOnePlayerMode}
        />
      )}
      {currentScreen === 'end' && (
        <EndGameScreen
          isWinner={isWinner}
          handleRetry={handleRetry}
          handleMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
};

export default LocalGame;
