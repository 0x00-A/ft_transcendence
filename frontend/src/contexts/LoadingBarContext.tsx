// LoadingBarContext.tsx
import {
  createContext,
  useRef,
  ReactNode,
  MutableRefObject,
  useContext,
} from 'react';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';

// context type
export type LoadingBarContextType = MutableRefObject<LoadingBarRef | null>;

// context with a default value of null
const LoadingBarContext = createContext<LoadingBarContextType | null>(null);

interface LoadingBarProviderProps {
  children: ReactNode;
}

// provider component
export const LoadingBarProvider = ({ children }: LoadingBarProviderProps) => {
  const loadingBarRef = useRef<LoadingBarRef>(null);

  return (
    <LoadingBarContext.Provider value={loadingBarRef}>
      {children}
      <LoadingBar color="#f11946" waitingTime={200} ref={loadingBarRef} />
    </LoadingBarContext.Provider>
  );
};

export const useLoadingBar = () => {
  const context = useContext(LoadingBarContext);
  if (!context) {
    throw new Error('useLoadingBar must be used within a LoadingBarProvider');
  }
  return context;
};

// export { LoadingBarContext, LoadingBarProvider };
