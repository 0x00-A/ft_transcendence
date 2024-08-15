import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import css from './Games.module.css';
import FlexHeader from '../../components/Layout/FlexHeader/FlexHeader';
import { useState } from 'react';
import PongGame from '../../components/Game/PongGame/PongGame';
import FlexContainer from '../../components/Layout/FlexContainer/FlexContainer';
import BodyContainer from '../../components/Layout/BodyContainer/BodyContainer';

const Games = () => {
  const { isLoggedIn } = useAuth();
  const [selectedGame, SetSelectedGame] = useState('0');

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <FlexContainer className={css.container}>
      <FlexHeader className={css.header}>
        <section className={css.gameSelect}>
          <img src="/icons/pong.svg" alt="" />
          <select
            value={selectedGame}
            onChange={(e) => {
              SetSelectedGame(e.target.value);
            }}
          >
            <option value="0">PingPong Game</option>
            <option value="1">Another Game</option>
          </select>
        </section>
        <section className={css.gameCoins}>
          <p>Coins</p>
          <p>99999999</p>
          <img src="/icons/coins.svg" alt="" />
        </section>
      </FlexHeader>
      <BodyContainer className={selectedGame === '0' ? css.lobby : ''}>
        {selectedGame === '0' && <PongGame />}
        {selectedGame === '1' && <p>Another game</p>}
      </BodyContainer>
    </FlexContainer>
  );
};

export default Games;
