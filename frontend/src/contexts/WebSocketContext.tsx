// WebSocketContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
// import { WebSocketContextType, Notification } from './types';

// types.ts
export type MessageType = 'invite' | 'friend_request' | 'status_update';

export interface Notification {
  type: MessageType;
  from: string; // username or ID of sender
  content: string; // additional message content
  timestamp: Date;
}

export interface WebSocketContextType {
  notifications: Notification[];
  sendMessage: (message: Record<string, any>) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket('wss://your-websocket-server-url');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      // Send authentication or setup message if needed
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (
        data.type === 'invite' ||
        data.type === 'friend_request' ||
        data.type === 'status_update'
      ) {
        handleIncomingNotification(data);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      // Optional: Reconnect logic if needed
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleIncomingNotification = (data: Record<string, any>) => {
    const newNotification: Notification = {
      type: data.type,
      from: data.from,
      content: data.content || '',
      timestamp: new Date(),
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const sendMessage = (message: Record<string, any>) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not open. Can't send message:", message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ notifications, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
