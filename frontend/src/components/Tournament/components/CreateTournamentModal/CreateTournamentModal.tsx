import { useTranslation } from 'react-i18next';
import css from './CreateTournamentModal.module.css';
import { useState } from 'react';

const CreateTournamentModal = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}) => {
  const [tournamentName, setTournamentName] = useState('');
  const { t } = useTranslation();


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTournamentName(e.target.value);
  };

  const handleSubmit = () => {
    if (tournamentName.trim()) {
      onSubmit(tournamentName);
      setTournamentName('');
      onClose();
    } else {
      alert(t('game.remoteTournament.CreateTournamentModal.AlertMessage'));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={css.modalOverlay}>
      <div className={css.modalContent}>
        <label className={css.label}>{t('game.remoteTournament.CreateTournamentModal.Label')}</label>
        <input
          type="text"
          placeholder={t('game.remoteTournament.CreateTournamentModal.InputPlaceholder')}
          value={tournamentName}
          onChange={handleInputChange}
          maxLength={15}
        />
        <button className={css.submitButton} onClick={handleSubmit}>{t('game.remoteTournament.CreateTournamentModal.SubmitButton')}</button>
        <button onClick={onClose}>{t('game.remoteTournament.CreateTournamentModal.CancelButton')}</button>
      </div>
    </div>
  );
};

export default CreateTournamentModal;
