// GameInviteContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

// type GameInvite = {
//   from: string;
//   gameId: string;
//   gameUrl?: string;
// };

type GameInviteContextType = {
  gameInvite: string | null;
  gameAccepted: boolean;
  // sendInvite: (inviteDetails: GameInvite) => void;
  acceptInvite: (gameUrl: string) => void;
  setGameAccepted: React.Dispatch<React.SetStateAction<boolean>>;
};

const GameInviteContext = createContext<GameInviteContextType | undefined>(undefined);

export const GameInviteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameInvite, setGameInvite] = useState<string | null>(null);
  const [gameAccepted, setGameAccepted] = useState<boolean>(false);

  // const sendInvite = (inviteDetails: GameInvite) => {
  //   setGameInvite(inviteDetails);
  // };

  const acceptInvite = (gameUrl: string) => {
    setGameAccepted(true);
    setGameInvite(gameUrl);
  };

  return (
    <GameInviteContext.Provider value={{ gameInvite, gameAccepted, setGameAccepted, acceptInvite }}>
      {children}
    </GameInviteContext.Provider>
  );
};

export const useGameInvite = (): GameInviteContextType => {
  const context = useContext(GameInviteContext);
  if (context === undefined) {
    throw new Error('useGameInvite must be used within a GameInviteProvider');
  }
  return context;
};
