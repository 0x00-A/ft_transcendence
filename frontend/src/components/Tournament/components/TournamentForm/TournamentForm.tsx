import React, { useState } from 'react';
import styles from './TournamentForm.module.css';

interface FormProps {
  onSubmit: (players: string[]) => void;
  players: string[];
  setPlayers: (players: string[]) => void;
}

const TournamentForm = ({ onSubmit, players, setPlayers }: FormProps) => {
  const [playerName, setPlayerName] = useState<string>('');
  const [error, setError] = useState<string>(''); // To store error messages

  const handleAddPlayer = () => {
    if (!playerName.trim()) {
      setError('Player name cannot be empty');
      return;
    }

    if (players.includes(playerName)) {
      setError('Player name must be unique');
      return;
    }

    if (players.length < 4) {
      setPlayers([...players, playerName.trim()]);
      setPlayerName('');
      setError('');
    }
  };

  const handleRemovePlayer = (index: number) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
  };

  const handleStartTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (players.length === 4) onSubmit(players);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Tournament Registration</h2>

      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
        maxLength={15}
        className={styles.input}
      />

      <button
        onClick={handleAddPlayer}
        disabled={!playerName || players.length >= 4}
        className={styles.addButton}
      >
        Add Player
      </button>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <ul className={styles.playerList}>
        {players.map((player, index) => (
          <li key={index} className={styles.playerItem}>
            {player}
            <button
              onClick={() => handleRemovePlayer(index)}
              className={styles.removeButton}
            >
              &#x2716;
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleStartTournament}
        disabled={players.length !== 4}
        className={`${styles.startButton} ${
          players.length === 4 ? styles.enabled : styles.disabled
        }`}
      >
        Start Tournament
      </button>
    </div>
  );
};

export default TournamentForm;
