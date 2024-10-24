import css from './Bracket.module.css';

const Match = ({
  matchNumber = 0,
  player1,
  player2,
  winner,
}: {
  matchNumber?: Number;
  player1: string;
  player2: string;
  winner: Number;
}) => {
  return (
    <div className={css.matchup}>
      <div className={css.participants}>
        <div className={`${css.participant} ${winner === 1 ? css.winner : ''}`}>
          <span>{player1}</span>
        </div>
        <div className={`${css.participant} ${winner === 2 ? css.winner : ''}`}>
          <span>{player2}</span>
        </div>
      </div>
    </div>
  );
};

const Connector = () => {
  return (
    <div className={css.connector}>
      <div className={css.merger}></div>
      <div className={css.line}></div>
    </div>
  );
};

const Bracket = () => {
  return (
    <div className={css.bracket}>
      <section className={`${css.round} ${css.quarterfinals}`}>
        <div className={css.winners}>
          <div className={css.matchups}>
            <Match matchNumber={1} player1="Uno" player2="Ocho" winner={1} />
            <Match matchNumber={2} player1="Dos" player2="Ocho" winner={2} />
          </div>
          <Connector />
        </div>

        <div className={css.winners}>
          <div className={css.matchups}>
            <Match matchNumber={3} player1="Treis" player2="Seis" winner={2} />
            <Match
              matchNumber={4}
              player1="Cuatro"
              player2="Cinco"
              winner={2}
            />
          </div>
          <Connector />
        </div>
      </section>

      <section className={`${css.round} ${css.semifinals}`}>
        <div className={css.winners}>
          <div className={css.matchups}>
            <Match matchNumber={5} player1="Uno" player2="Dos" winner={1} />
            <Match matchNumber={6} player1="Seis" player2="Cinco" winner={1} />
          </div>
          <Connector />
        </div>
      </section>

      <section className={`${css.round} ${css.finals}`}>
        <div className={css.winners}>
          <div className={css.matchups}>
            <Match matchNumber={7} player1="Uno" player2="Seis" winner={1} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bracket;
