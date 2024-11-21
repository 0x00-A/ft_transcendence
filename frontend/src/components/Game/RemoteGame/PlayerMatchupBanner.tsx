import React from 'react';
import { Swords, Trophy, Shield } from 'lucide-react';

const PlayerMatchupBanner = () => {
  const players = {
    player1: {
      username: "CyberPaddler87",
      rank: "Gold",
      avatar: "https://picsum.photos/200"
    },
    player2: {
      username: "QuantumPong",
      rank: "Platinum",
      avatar: "https://picsum.photos/200"
    }
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
          <span className="font-semibold text-lg">{players.player1.username}</span>
          <div className="flex items-center space-x-1 mt-0.5">
            {/* <Trophy className="text-yellow-400" size={14} /> */}
            <Shield size={16} className="text-green-500" />
            <span className="text-base text-gray-400">{players.player1.rank}</span>
          </div>
        </div>
      </div>

      {/* VS Section */}
      <div className="flex items-center">
        <Swords
          className="text-red-500/50 animate-pulse"
          size={24}
        />
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
          <span className="font-semibold text-lg">{players.player2.username}</span>
          <div className="flex items-center space-x-1 mt-0.5">
            <span className="text-base text-gray-400">{players.player2.rank}</span>
            {/* <Trophy className="text-yellow-400" size={14} /> */}
            <Shield size={16} className="text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerMatchupBanner;