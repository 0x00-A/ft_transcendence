import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types/apiTypes';
import { useGetData } from '@/api/apiHooks';

interface UserContextType {
  user: User | null | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

const defaultContextValue: UserContextType = {
  user: null,
  isLoading: true,
  error: null,
  refetch: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {

  const { data: user, isLoading, error, refetch } = useGetData<User>('matchmaker/current-user/me');

  return (
    <UserContext.Provider value={{ user, isLoading, error, refetch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
