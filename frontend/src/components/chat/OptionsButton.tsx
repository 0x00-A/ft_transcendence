import css from './OptionsButton.module.css';
import NewMessage from './NewMessage';

const OptionsButton = () => {

  return (
    <div className={css.optionsButtonContainer}>
      <h2 className={css.title}>Chat</h2>

      <div className={css.sideButtons}>
        <NewMessage  />
      </div>
    </div>
  );
};

export default OptionsButton;
