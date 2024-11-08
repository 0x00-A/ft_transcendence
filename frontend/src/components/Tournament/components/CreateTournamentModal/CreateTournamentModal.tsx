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

  const handleInputChange = (e) => {
    setTournamentName(e.target.value);
  };

  const handleSubmit = () => {
    if (tournamentName.trim()) {
      onSubmit(tournamentName);
      setTournamentName('');
      onClose();
    } else {
      alert('Please enter a tournament name.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={css.modalOverlay}>
      <div className={css.modalContent}>
        <h2>Create Tournament</h2>
        <input
          type="text"
          placeholder="Enter tournament name"
          value={tournamentName}
          onChange={handleInputChange}
          maxLength={15}
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default CreateTournamentModal;
