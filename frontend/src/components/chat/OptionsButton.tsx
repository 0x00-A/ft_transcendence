import css from './OptionsButton.module.css';
import MoreButton from './MoreButton';

const OptionsButton = () => {
  const handleOptionsClick = () => {
    console.log('Options button clicked');
  };
  return (
    <button className={css.optionsButton}>
      <MoreButton onClick={handleOptionsClick} />
    </button>
  );
};

export default OptionsButton;
