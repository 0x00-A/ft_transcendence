import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TypingContextType {
  typing: { typing: boolean; receiverId: number | null };
  setTyping: React.Dispatch<React.SetStateAction<{ typing: boolean; receiverId: number | null }>>;
}

const TypingContext = createContext<TypingContextType | undefined>(undefined);

interface TypingProviderProps {
  children: ReactNode;
}

export const TypingProvider: React.FC<TypingProviderProps> = ({ children }) => {
  const [typing, setTyping] = useState<{ typing: boolean; receiverId: number | null }>({ typing: false, receiverId: null });

  return (
    <TypingContext.Provider value={{ typing, setTyping }}>
      {children}
    </TypingContext.Provider>
  );
};

export const useTyping = (): TypingContextType => {
  const context = useContext(TypingContext);
  if (!context) {
    throw new Error('useTyping must be used within a TypingProvider');
  }
  return context;
};
