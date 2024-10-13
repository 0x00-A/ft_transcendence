import css from './GameModeScreen.module.css';

import { GameScreens } from '../../../../types/types';
import { log } from 'console';
import { useState } from 'react';

const GameModeScreen = ({
  onNext,
  SetIsOnePlayerMode,
  SwitchSound,
  sound,
}: {
  onNext: (nextScreen: GameScreens) => void;
  SetIsOnePlayerMode: React.Dispatch<React.SetStateAction<boolean>>;
  SwitchSound: React.Dispatch<React.SetStateAction<boolean>>;
  sound: boolean;
}) => {
  const [active, setActive] = useState(sound);

  return (
    <div id="gameModeScreen" className={css.gameScreenDiv}>
      <button
        onClick={() => {
          onNext('game');
          SetIsOnePlayerMode(true);
        }}
      >
        One Player
      </button>
      <button
        onClick={() => {
          onNext('game');
          SetIsOnePlayerMode(false);
        }}
      >
        Two Players
      </button>

      <div className={css.soundButtonWrapper}>
        <button
          style={
            active
              ? { backgroundColor: 'lightgray' }
              : { backgroundColor: 'transparent' }
          }
          id="soundButton"
          className={`${css.soundButton} ${css.soundOff}`}
          onClick={(sound) => {
            console.log('switch');

            SwitchSound(!sound);
            setActive((active) => !active);
          }}
          aria-label="Toggle Sound"
        ></button>
        <label htmlFor="soundButton" className={css.soundButtonLabel}>
          SOUND
        </label>
      </div>
      {/* <div id="optionsButton" className={css.optionsButton} onclick="OpenOptions();">
          Options
        </div> */}
    </div>
  );
};

export default GameModeScreen;
