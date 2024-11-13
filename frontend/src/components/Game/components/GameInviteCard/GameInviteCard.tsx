import React, { useState, useEffect } from 'react';
import { Check, X, GamepadIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import styles from './GameInviteCard.module.css';

interface GameInviteCardProps {
  playerName?: string;
//   gameName?: string;
//   gameMode?: string;
  duration?: number;
  onAccept: () => void;
  onReject: () => void;
}

const GameInviteCard: React.FC<GameInviteCardProps> = ({
  playerName = 'Player123',
//   gameName = 'Rocket League',
//   gameMode = 'Competitive 2v2',
  duration = 30,
  onAccept,
  onReject
}) => {
  const [seconds, setSeconds] = useState(duration);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            setVisible(false);
            onReject(); // Auto-reject when timer expires
          }, 1000);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onReject]);

  const handleAccept = () => {
    setVisible(false);
    onAccept();
  };

  const handleReject = () => {
    setVisible(false);
    onReject();
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={`${styles.cardContainer} ${seconds === 0 ? styles.hidden : styles.visible}`}>
      <Card>
        <CardHeader className={styles.cardHeader}>
          <div className={styles.iconContainer}>
            <GamepadIcon className="w-12 h-12 text-purple-600" />
          </div>
          <CardTitle className={styles.cardTitle}>Game Invitation</CardTitle>
        </CardHeader>

        <CardContent className={styles.cardContent}>
          <div className="mb-4">
            <span className={`${styles.timerContainer} ${seconds <= 10 ? styles.timerRed : styles.timerGray}`}>
              {seconds} seconds
            </span>
          </div>
          <p className={styles.playerName}>{playerName} invited you to a game</p>
          {/* <h3 className={styles.gameName}>{gameName}</h3>
          <p className={styles.gameMode}>{gameMode}</p> */}
        </CardContent>

        <CardFooter className={styles.cardFooter}>
          <button
            className={styles.acceptButton}
            onClick={handleAccept}
          >
            <Check className="w-5 h-5" />
            Accept
          </button>

          <button
            className={styles.declineButton}
            onClick={handleReject}
          >
            <X className="w-5 h-5" />
            Decline
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameInviteCard;
