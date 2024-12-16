import { useTranslation } from 'react-i18next';
import styles from './Welcome.module.css';

const Welcome = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.content}>
      <div>
        <h2 className={styles.title}>{t('welcome.title')}</h2>
        <p className={styles.description}>
          {t('welcome.description')}
        </p>
      </div>
      <button className={styles.playButton}>{t('welcome.playButton')}</button>
    </div>
  );
};

export default Welcome;
