// WebSocketContext.tsx
import GameInviteCard from '@/components/Game/components/GameInviteCard/GameInviteCard';
import getWebSocketUrl from '@/utils/getWebSocketUrl';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { toast } from 'react-toastify';
import { useGameInvite } from './GameInviteContext';
// import { WebSocketContextType, Notification } from './types';

// types.ts
export type MessageType =
  | 'game_invite'
  | 'error'
  | 'friend_request'
  | 'status_update';

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

  const { acceptInvite } = useGameInvite();

  const showGameInviteToast = (from: string) => {
    toast(
      <GameInviteCard
        from={from}
        onAccept={() => handleAcceptInvite(from)}
        onReject={() => handleRejectInvite(from)}
      />,
      {
        toastId: from,
        autoClose: 10000,
        closeOnClick: false,
        closeButton: false,
        style: {
          padding: '0',
          margin: '0',
        },
      }
    );
  };

  const handleAcceptInvite = (from: string) => {
    console.log(`Accepted invite from ${from}`);
    sendMessage({
      event: 'invite_accept',
      from: from,
    });
    toast.dismiss();
  };

  const handleRejectInvite = (from: string) => {
    console.log(`Rejected invite from ${from}`);
    sendMessage({
      event: 'invite_reject',
      from: from,
    });
    toast.dismiss(from);
  };

  useEffect(() => {
    setTimeout(() => {
      ws.current = new WebSocket(`${getWebSocketUrl('notifications/')}`);

      ws.current.onopen = () => {
        console.log('Notification WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.event === 'friend_request' || data.event === 'status_update') {
          handleIncomingNotification(data);
        }

        if (data.event === 'game_invite') {
          // toast.info(data.message)
          showGameInviteToast(data.from);
        }
        if (data.event === 'error') {
          toast.error(data.message);
        }
        if (data.event === 'invite_reject') {
          toast.info(data.message);
        }
        if (data.event === 'game_address') {
          toast.info(data.message);
          acceptInvite(data.game_address);
        }
      };

      ws.current.onclose = () => {
        console.log('Notification WebSocket disconnected');
        // Reconnect logic
      };

      return () => {
        ws.current?.close();
      };
    }, 500);
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
