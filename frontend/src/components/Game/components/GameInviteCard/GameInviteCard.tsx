import React, { useState, useEffect } from 'react';
import { Check, X, GamepadIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import styles from './GameInviteCard.module.css';

interface GameInviteCardProps {
  from?: string;
//   gameName?: string;
//   gameMode?: string;
  duration?: number;
  onAccept: () => void;
  onReject: () => void;
}

const GameInviteCard: React.FC<GameInviteCardProps> = ({
  from = 'Player123',
//   gameName = 'Rocket League',
//   gameMode = 'Competitive 2v2',
  duration = 10,
  onAccept,
  onReject
}) => {
  const [seconds, setSeconds] = useState(duration);
  // const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            // setVisible(false);
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
    // setVisible(false);
    onAccept();
  };

  const handleReject = () => {
    // setVisible(false);
    onReject();
  };

  // if (!visible) {
  //   return null;
  // }

  return (
    <div className={`${styles.cardContainer}`}>
      <Card className='bg-transparent border-none p-0 m-0'>
        <CardHeader className={styles.cardHeader}>
          <div className={styles.iconContainer}>
            <GamepadIcon className="w-12 h-12 text-white" />
          </div>
          <CardTitle className={styles.cardTitle}>Game Invitation</CardTitle>
        </CardHeader>

        <CardContent className={styles.cardContent}>
          <div className="mb-4">
            <span className={`${styles.timerContainer} ${seconds <= 5 ? styles.timerRed : styles.timerGray}`}>
              {seconds}
            </span>
          </div>
          <p className={styles.playerName}>{from} invited you to a game</p>
        </CardContent>

        <CardFooter className={styles.cardFooter}>
          <button
            className={styles.acceptButton}
            onClick={handleAccept}
          >
            <Check className="w-10 h-10" />
            {/* Accept */}
          </button>

          <button
            className={styles.declineButton}
            onClick={handleReject}
          >
            <X className="w-10 h-10" />
            {/* Decline */}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameInviteCard;
