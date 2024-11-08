import { Navigate } from 'react-router-dom';
import css from './ModeSelection.module.css';
import FlexHeader from '../../../components/Layout/FlexHeader/FlexHeader';
import { useState } from 'react';
import FlexContainer from '../../../components/Layout/FlexContainer/FlexContainer';
import BodyContainer from '../../../components/Layout/BodyContainer/BodyContainer';
import { useNavigate } from 'react-router-dom';

const ModeSelection = () => {
  const [selectedGame, SetSelectedGame] = useState('0');

  const navigate = useNavigate();

  return (
    <div className={css.container}>
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
          {/* {selectedGame === '0' && <PongGame />} */}
          {selectedGame === '1' && <p>Another game</p>}
        </BodyContainer>
      </FlexContainer>
    </div>
  );
};

export default ModeSelection;
