import css from './OptionsButton.module.css';
import NewMessage from './NewMessage';
import { useTranslation } from 'react-i18next';


const OptionsButton = () => {
  const { t } = useTranslation();


  return (
    <div className={css.optionsButtonContainer}>
      <h2 className={css.title}>{t('optionsButton')}</h2>

      <div className={css.sideButtons}>
        <NewMessage  />
      </div>
    </div>
  );
};

export default OptionsButton;
