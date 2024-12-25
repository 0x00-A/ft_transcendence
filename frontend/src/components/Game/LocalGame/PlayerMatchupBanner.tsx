import { Swords, Shield } from 'lucide-react';
import { useGetData } from '@/api/apiHooks';
import { User } from '@/types/apiTypes';
import { useEffect, useState } from 'react';
import { GameState } from '@/types/types';

const MatchTimer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return <div className="font-mono text-2xl">{formatTime(seconds)}</div>;
};

const PlayerMatchupBanner = ({isOnePlayerMode}: {isOnePlayerMode: boalean}) => {
  const players = {
    player1: {
      username: isOnePlayerMode ? 'You' : 'Player 1',
      avatar: 'https://picsum.photos/200',
    },
    player2: {
      username: isOnePlayerMode ? 'Computer' : 'Player 2',
      avatar: 'https://picsum.photos/200',
    },
  };

  return (
    <div className="ml-auto mr-auto w-[662px] bg-gray-900 text-white py-4 px-5 flex items-center justify-between border rounded-full border-red-500">
      {/* Player 1 Section */}
      <div className="flex items-center gap-3 space-x-3">
        <div className="w-16 h-16 rounded-full border-2 border-green-500 overflow-hidden">
          <img
            src={players.player1.avatar}
            alt={players.player1.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-lg">
            {players.player1.username}
          </span>
        </div>
      </div>

      {/* VS Section */}
      <div className="flex items-center justify-center flex-col gap-1">
        <Swords className="text-red-500/50 animate-pulse" size={24} />
        <MatchTimer />
      </div>

      {/* Player 2 Section */}
      <div className="flex items-center gap-3 space-x-3 flex-row-reverse text-right">
        <div className="w-16 h-16 rounded-full border-2 border-red-500 overflow-hidden">
          <img
            src={players.player2.avatar}
            alt={players.player2.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-end">
          <span className="font-semibold text-lg">
            {players.player2.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerMatchupBanner;
