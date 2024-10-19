import { GameScreens } from '../../types/types';
import GameButton from '../Game/components/GameButton/GameButton';
import css from './DifficultyScreen.module.css';

const DifficultyScreen = ({
  onNext,
  setBallSpeed,
  setPaddleSpeed,
}: {
  onNext: (nextScreen: GameScreens) => void;
  setBallSpeed: React.Dispatch<React.SetStateAction<number>>;
  setPaddleSpeed: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className={css.gameScreenDiv}>
      <p className={css.title}>Choose Difficulty</p>
      <GameButton
        onClick={() => {
          onNext('game');
          setBallSpeed(3);
          setPaddleSpeed(5);
        }}
      >
        Easy
      </GameButton>
      <GameButton
        onClick={() => {
          onNext('game');
          setBallSpeed(5);
          setPaddleSpeed(8);
        }}
      >
        Normal
      </GameButton>
      <GameButton
        onClick={() => {
          onNext('game');
          setBallSpeed(7);
          setPaddleSpeed(10);
        }}
      >
        Hard
      </GameButton>
    </div>
  );
};

export default DifficultyScreen;
