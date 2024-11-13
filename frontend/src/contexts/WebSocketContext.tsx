// WebSocketContext.tsx
import getWebSocketUrl from '@/utils/getWebSocketUrl';
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

// type MessageData = { [key: string]: any };
export type MessageData = Record<string, any>; // object can have any number of fields

// type MessageData = {
//   id: string;
//   content: string;
//   timestamp?: string; // Optional field
//   [key: string]: any;  // Allows extra fields while keeping known properties typed
// };

interface WebSocketContextType {
  sendMatchmakerMessage: (message: MessageData) => void;
  sendNotificationMessage: (message: MessageData) => void;
  setMatchmakerMessage: React.Dispatch<React.SetStateAction<MessageData | null>>;
  matchmakerMessage: MessageData | null;
  notificationMessage: MessageData | null;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

const defaultContextValue: WebSocketContextType = {
  sendMatchmakerMessage: () => {},
  sendNotificationMessage: () => {},
  setMatchmakerMessage: () => {},
  matchmakerMessage: null,
  notificationMessage: null,
};

const WebSocketContext = createContext<WebSocketContextType>(defaultContextValue);

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const matchmakerSocket = useRef<WebSocket | null>(null);
  const notificationSocket = useRef<WebSocket | null>(null);
  const [matchmakerMessage, setMatchmakerMessage] = useState<MessageData | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<MessageData | null>(null);

  useEffect(() => {
    // matchmaker WebSocket
    matchmakerSocket.current = new WebSocket(`${getWebSocketUrl('matchmaking/')}`);
    matchmakerSocket.current.onopen = () => console.log('Matchmaker WebSocket connected');
    matchmakerSocket.current.onmessage = (event) => setMatchmakerMessage(JSON.parse(event.data));
    matchmakerSocket.current.onclose = () => console.log('Matchmaker WebSocket disconnected');

    // notification WebSocket
    notificationSocket.current = new WebSocket(`${getWebSocketUrl('notifications/')}`);
    notificationSocket.current.onopen = () => console.log('Notification WebSocket connected');
    notificationSocket.current.onmessage = (event) => setNotificationMessage(JSON.parse(event.data));
    notificationSocket.current.onclose = () => console.log('Notification WebSocket disconnected');

    return () => {
      matchmakerSocket.current?.close();
      notificationSocket.current?.close();
    };
  }, []);

  const sendMatchmakerMessage = (message: MessageData) => {
    if (matchmakerSocket.current?.readyState === WebSocket.OPEN) {
      console.log(`sending message: ${message}`);

      matchmakerSocket.current.send(JSON.stringify(message));
    }
  };

  const sendNotificationMessage = (message: MessageData) => {
    if (notificationSocket.current?.readyState === WebSocket.OPEN) {
      notificationSocket.current.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMatchmakerMessage, sendNotificationMessage, matchmakerMessage, notificationMessage, setMatchmakerMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
