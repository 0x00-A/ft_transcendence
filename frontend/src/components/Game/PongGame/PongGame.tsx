import GameMode from './components/GameMode/GameMode';
import css from './PongGame.module.css';

const PongGame = () => {
  return (
    <div className={css.lobby}>
      <div className="title">
        <p>MODE</p>
      </div>
      {/* <h1 className={`${css['center-title']} ${css.cornerBorder}`}>MODE</h1> */}
      <div className={css.modes}>
        <section className={css.sectionOne}>
          <GameMode className={css.local} title="LOCAL">
            Play with a friend on the same keybaord
          </GameMode>
          <GameMode className={css.remote} title="REMOTE">
            Play with a friend remotely
          </GameMode>
        </section>
        <section className={css.sectionTwo}>
          <GameMode className={css.tournament} title="TOURNAMENT">
            Join or create a tournament
          </GameMode>
          <section className={css.sectionThree}>
            <GameMode className={css.ai} title="AI">
              Play agains AI
            </GameMode>
            <GameMode className={css.multi} title="MULTIPLAYER">
              Battle Royal
            </GameMode>
          </section>
        </section>
      </div>
    </div>
  );
};

export default PongGame;
